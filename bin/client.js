// #TheWatcher
// By #TheDoxMedia
// Client.js
//
// Client Spawner.. Used for spawning a new child to the
// TheWatcher server.

var io = require('socket.io-client')
var os = require('os')
var Utils = require('./utils/utils')
var extend = require('xtend')
var EventEmitter = require('events').EventEmitter
var util = require('util')
var Logger = require('./logger')

var Client = module.exports = function () {
  var self = this

  // Load server config

  EventEmitter.call(self)
}

util.inherits(Client, EventEmitter)

Client.prototype.start = function () {
  var self = this

  // Setup logging
  self.log = new Logger('Client', 'silly').log

  self.log.info(`TheWatcher Client mode running`)

  // Load client config
  self.conf = (self.conf === undefined)
    ? extend(Utils.client.load.config('client'), self.conf)
    : self.conf

  self.socket = io.connect('wss://' + self.conf.server, {
    'secure': true,
    'forceNew': true
  })

  self.log.info(`Connecting ${self.conf.name}@${self.conf.server}`)

  self.socket.on('connect', function (sio) {
    self.log.info(`Connected to server sid:${self.socket.id}`)

    // Credentials prep
    var prepMsg = JSON.stringify({
      session: self.socket.id,
      sha_id: self.conf.id,
      name: self.conf.name
    })

    // Sign credentials prep message (Object) and on successful callback
    // Perform authentication request.
    Utils.client.sign(self.conf.key.private, prepMsg, function (signed) {
      self.log.info(`Client authentication request over WebSocket`)

      // Perform authentication request
      self.socket.emit('authentication', {
        name: self.conf.name,
        sha_id: self.conf.id,
        signed: signed
      })
    })
  })

  self.socket.on('authenticated', function () {
    self.log.info(`Client authenticated!`)    
    self.emit('status', null, { message: 'connected' })

    // Start Data heartbeat
    self.heartbeat()
  })

  self.socket.on('unauthorized', function (err) {
    self.log.error(`Client unauthorized (From Server: ${err})`)
    self.emit('status', err, null)
  })

  self.socket.on('reconnecting', function (attempt) {
    self.emit('status', null, { message: 'reconnecting', attempt: attempt })
  })

  self.socket.on('disconnect', function () {
    self.log.info(`Disconnected from server`)
    self.emit('status', null, { message: 'disconnected' })
  })

  self.socket.on('error', function (err) {
    self.log.error(`Error ${err}`)
    self.emit('status', err, { message: 'disconnected' })
  })
}

Client.prototype.heartbeat = function () {
  var self = this

  setInterval(function () {
    var heartbeatTime = Date.now()

    self.socket.emit('client-heartbeat', {
      name: self.conf.name,
      time: heartbeatTime,
      data: HeartBeatData()
    })
  }, self.conf.interval)
}

function HeartBeatData () {
  return JSON.stringify({
    uptime: os.uptime(),
    memory: {
      free: os.freemem(),
      total: os.totalmem()
    },
    cup: {
      loadavg: os.loadavg()
    }
  })
}
