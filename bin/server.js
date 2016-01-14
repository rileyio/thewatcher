// #TheWatcher
// By #TheDoxMedia
// Server.js

var app = require('express')()
var extend = require('xtend')
var https = require('https')
var io = require('socket.io')
var sioAuth = require('socketio-auth')
var fs = require('fs')
var path = require('path')
var Utils = require('./utils/utils')
var Logger = require('./logger')

// Databases
var Loki = require('lokijs')
var Database = require('./db/database')

// Shorten proc.env
var Env = process.env

var Server = module.exports = function () {
  var self = this

  // Set conf
  self.conf = undefined

  // Setup logging
  self.log = new Logger('Server', 'silly').log

  // HTTPS Certificate config
  self.httpsOpts = {
    key: fs.readFileSync(Env.PWD + '/conf/certs/server.key'),
    cert: fs.readFileSync(Env.PWD + '/conf/certs/server.crt')
  }

  // Express config
  // -- Set View Engine
  app.set('view engine', 'ejs')

  // Set space for running Sio
  self.io
  self.https
}

Server.prototype.start = function () {
  var self = this

  self.log.info(`Starting..`)

  // Load server config if not loaded yet
  self.conf = (self.conf === undefined)
    ? extend(Utils.server.load.config('server'))
    : self.conf

  // Setup Primary DB
  self.DB = new Database(self.conf.db)

  // Setup MemDB
  self.MemDB = new Loki('loki.json')

  // Live Data (Uptime, Mem, CPU, etc)
  self.HBData = self.MemDB.addCollection('live-client-data')

  // Admin connections
  self.ConnectedAdmins = self.MemDB.addCollection('connected-admins')

  // Listen for start of handshakes from clients
  app.get('/', function (req, res) {
    res.send(404)
  })

  // Listen for admins connecting to monitoring panel
  app.get('/admin', function (req, res) {
    // Send local server monitoring panel
    res.render(path.join(Env.PWD, '/resources/server/www/index'), {
      // Send server's key & name for logging in locally
      svrUserName: self.conf.name
    })
  })

  // Initaialize Socket IO with given port in server config
  self.https = https.createServer(self.httpsOpts, app)
    .listen(self.conf.port, function () {
      var host = self.https.address().address
      var port = self.https.address().port

      // Good to listen
      // Print successful startup
      self.log.verbose(`HTTPS::Server->Listening(//${host}:${port})`)
    })

  // //////////////////////////////////////////////////////////////
  // ///  Socket.IO Below /////////////////////////////////////////
  self.io = io(self.https)

  // Setup SocketIO Authentication
  sioAuth(self.io, {
    authenticate: function (socket, data, callback) {
      self.log.verbose(`SIO::Auth->Req('${data.name}', ${socket.id}, ${data.sha_id})`)

      // If self connecting (i.e. From https://127.0.0.1:<port>/admin)
      if (self.conf.name === data.name) {
        Utils.server.verifySig(self.conf.key.public, data.signed, function (ret) {
          if (ret.signatures[0].valid) {
            // Store admin in ConnectedAdmins MemDB
            self.ConnectedAdmins.insert({
              name: data.name,
              socket_id: socket.id
            })

            self.log.debug(`SIO::Auth->Admin(sid: ${socket.id})`)

            return callback(null, 'authenticated')
          } else {
            self.log.debug(`SIO::Auth->Error->Admin(sid: ${socket.id}, error: Signature check failed!)`)

            return callback(new Error('Authentication error!'))
          }
        })
      } else {
        // Check if client is in the HBData MemDB
        var inMemDB = self.HBData.findOne({
          name: data.name,
          sha_id: data.sha_id
        })

        // Refuse new user if !Admin & inMemDB === true
        if (inMemDB && self.conf.name !== data.name) {
          self.log.debug(`SIO::Auth->Disconnect(sid: ${socket.id}, error: Duplicate with different SocketID)`)

          return callback(new Error('Authentication error - Duplicate Client!'))
        }

        // Normal Clients - Lookup client in DB
        self.DB.client.get({
          name: data.name,
          sha_id: data.sha_id
        }, function (result) {
          // Results = True; and the client & pubkey could be fetched from the DB
          if (result) {
            // Validate payload using Client's stored Public Key
            Utils.server.verifySig(result.pubkey, data.signed, function (ret) {
              if (ret.signatures[0].valid) {
                // Save client's new socket_id id to DB
                self.DB.client.update({
                  name: data.name,
                  sha_id: data.sha_id,
                  socket_id: socket.id
                })

                // Add client to HBData array
                // Ignore Admins (current server via browser)
                if (!inMemDB && self.conf.name !== data.name) {
                  self.log.debug(`MemDB::HBData->add(name: ${data.name}, sid: ${socket.id}, id: ${data.sha_id})`)

                  // Create entry for new client
                  self.HBData.insert({
                    name: data.name,
                    sha_id: data.sha_id,
                    socket_id: socket.client.id,
                    data: {}
                  })
                }

                // Good callback - Client authenticated!
                return callback(null, 'authenticated')
              } else {
                self.log.debug(`SIO::Auth->Error->Client(sid: ${socket.id}, error: Signature check failed!)`)

                return callback(new Error('Authentication error!'))
              }
            })
          } else {
            self.log.debug(`SIO::Auth->Error->Client(sid: ${socket.id}, error: No client by name & id!)`, data)

            return callback(new Error('Client not found'))
          }
        })
      }
    },
    postAuthenticate: function (socket, data) {
      self.log.verbose(`SIO::Client->PostAuth(name: ${data.name}, sid: ${socket.id})`)
      socket.client.user = data.name

      socket.on('client-heartbeat', function (heartbeat) {
        // Update heartbeat mem db
        var update = self.HBData.findOne({ 'name': heartbeat.name })

        // Parse heartbeat.data
        update.data = JSON.parse(heartbeat.data)

      // console.log(update)
      })

      socket.on('disconnect', function () {
        // Remove client from live DB data
        self.log.verbose(`SIO::Client->Disconnected(sid: ${socket.client.id})`)

        // Get client in hb array
        var clientInHBArr = self.HBData.findOne({ 'socket_id': socket.client.id })

        // If Admin get in admin array
        var clientInAdminArr = self.ConnectedAdmins.findOne({ 'socket_id': socket.client.id })

        // Remove from hb array
        if (clientInHBArr) {
          self.HBData.remove(clientInHBArr)
        }

        // Remove from Connected Admins MemDB
        if (clientInAdminArr) {
          self.ConnectedAdmins.remove(clientInAdminArr)
        }
      })
    }
  })

  setInterval(function () {
    // Currently connected admin clients
    var currentAdmins = self.ConnectedAdmins.data

    // Prep data for emit.to of clients connected to server
    var prepData = self.HBData.data

    // Emit to each connected admin
    for (var index = 0; index < currentAdmins.length; index++) {
      var admin = currentAdmins[index]
      self.io.to(admin.socket_id).emit('server-stats', {
        hbData: prepData,
        adminsData: currentAdmins
      })
    }
  }, 1000)
}

Server.prototype.close = function () {
  var self = this

  self.https.close()
}
