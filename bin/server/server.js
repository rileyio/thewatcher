/* global __TW */
// #TheWatcher
// By #TheDoxMedia
// Server.js

var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var Utils = require('./../utils/utils')

// Express middleware
// var bodyParser = require('body-parser')
// var cookieParser = require('cookie-parser')
// var session = require('express-session')

// Databases
var Loki = require('lokijs')
var Database = require('./../db/database')

exports.start = function (config) {
  // Setup Primary DB
  var DB = new Database(config.db)

  // Setup MemDB
  var MemDB = new Loki('loki.json')
  var Heartbeats = MemDB.addCollection('heartbeats')

  // Clients running array
  var stats = {
    connected: 0
  }

  var silent = config.silent

  // Listen for start of handshakes from clients
  app.get('/', function (req, res) {
    // Send local server monitoring panel
    res.sendFile(__TW + '/resources/server/www/index.html')
  // if (!req.user) {
  //   res.send(401)
  // } else {
  //   res.json(req.user)
  // }
  })

  // Initaialize Socket IO with given port in server config
  var expressServer = http.listen(config.port, function () {
    var host = expressServer.address().address
    var port = expressServer.address().port

    // Good to listen
    // Print successful startup
    if (!silent) {
      console.log('TheWatcher >> Listening @ //%s:%s'.green, host, port)
    }
  // console.log(args)
  })

  // //////////////////////////////////////////////////////////////
  // ///  Socket.IO Below /////////////////////////////////////////

  require('socketio-auth')(io, {
    authenticate: function (socket, data, callback) {
      console.log('Socket IO Auth (i.e login)')

      // Lookup client in DB
      DB.client.get({
        name: data.name
      }, function (result) {
        if (result) {
          // console.log(result)
          Utils.server.verifySig(result.pubkey, data.signed, function (ret) {
            if (ret.signatures[0].valid) {
              // console.log(ret.signatures[0].valid)
              // Save client's new session id to DB
              DB.client.update({
                name: data.name,
                session: socket.id
              })

              return callback(null, 'authd')
            } else {
              return callback(new Error('Authentication error!'))
            }
          })
        } else {
          return callback(new Error('Client not found'))
        }
      })
    },
    postAuthenticate: function (socket, data) {
      console.log('Socket IO POSTAuth')

      var name = data.name
      socket.client.user = name

      // Check if client is in the heartbeats MemDB
      var inMemDB = Heartbeats.findOne({
        name: name,
        session: socket.client.id
      })

      // Add client to heartbeats array
      if (!inMemDB) {
        if (!silent) {
          console.log('TheWatcher >> Server >> MemDB::Heartbeats(add:%s)', name)
        }

        Heartbeats.insert({
          name: name,
          data: {}
        })
      }

      stats.connected++
      sendStats()

      socket.on('client-heartbeat', function (heartbeat) {
        // Update heartbeat mem db
        var update = Heartbeats.findOne({ 'name': heartbeat.name })

        // console.log(Heartbeats)
        // console.log(heartbeat.name)
        // console.log(update)

        update.data = heartbeat.data

      // console.log(update)
      })

      socket.on('server-stats', function (heartbeat) {
        socket.emit('server-stats', stats)
      // sendStats()
      })

      socket.on('disconnect', function (heartbeat) {
        stats.connected--
        sendStats()
      })

      // Side note: need to spawn or track admins for stats
      // and send data
      function sendStats () {
        console.log('Send Stats Called..')

        if (name === 'admin') {
          console.log('Send Stats To Admin!')
          io.to(socket.id).emit('server-stats', {
            stats: stats,
            heartbeats: Heartbeats.data
          })
        }
      }
    }
  })
}
