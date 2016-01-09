// #TheWatcher
// By #TheDoxMedia
// Client.js
//
// Client Spawner.. Used for spawning a new child to the
// TheWatcher server.

var io = require('socket.io-client')
var os = require('os')
var Utils = require('./../utils/utils')
var extend = require('xtend')

var Client = module.exports = function () {
  var self = this

  // Load server config
  self.conf = undefined
}

Client.prototype.start = function () {
  var self = this

  // Load client config
  self.conf = (self.conf === undefined)
    ? extend(Utils.client.load.config('client'), self.conf)
    : self.conf

  self.socket = io.connect('wss://' + self.conf.server, {
    'secure': true,
    'forceNew': true
  })

  self.socket.on('connect', function (sio) {
    var prepMsg = JSON.stringify({
      session: self.socket.id,
      sha_id: self.conf.id,
      name: self.conf.name
    })

    Utils.client.sign(self.conf.key.private, prepMsg, function (signed) {
      // console.log(signed)

      self.socket.emit('authentication', {
        name: self.conf.name,
        sha_id: self.conf.id,
        signed: signed
      })
    })
  })

  self.socket.on('authenticated', function () {
    console.log('Socket Connected!')

    // Start Data heartbeat
    self.heartbeat()
  })

  self.socket.on('unauthorized', function (err) {
    console.log('There was an error with the authentication:', err.message)
  })

  self.socket.on('reconnecting', function (attempt) {
    console.log('Reconnecting', attempt)
  })

  self.socket.on('disconnect', function () {
    console.log('Socket Disconnect!')
  })

  self.socket.on('error', function (err) {
    console.log('Error:', err)
  })

  console.log('TheWatcher >> Client >> Started!'.green)
}

Client.prototype.heartbeat = function () {
  var self = this

  setInterval(function () {
    var heartbeatTime = Date.now()

    // console.log(heartbeatTime)

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
