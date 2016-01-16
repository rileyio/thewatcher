/* global done */
/* global describe, before, after, it */

var TheWatcher = require('../bin/app')
var should = require('should')

describe('Loading TheWatcher', function () {
  // process.env.NODE_ENV = 'test'
  var server = new TheWatcher.Server()
  var client = new TheWatcher.Client()

  // Set silent mode
  // TheWatcher.config.silent = true

  // Server Test Config
  var serverConf = {
    name: 'TheWatcher - Test Server',
    port: 9905,
    lat: '0.0',
    lon: '0.0',
    db: {
      type: 'mysql',
      host: '127.0.0.1',
      database: 'thewatcher',
      user: 'root',
      pass: ''
    }
  }

  // Client Test Config
  var clientConf = {
    name: 'TheWatcher - Test Client',
    server: '127.0.0.1:9905',
    lat: '0.0',
    lon: '0.0'
  }

  after(function (next) {
    setTimeout(function () {
      server.close()
      next()
    }, 5000)
  })

  describe('Server', function () {
    it('generate server config & keys', function (next) {
      // Set timeout to prevent default timeout on key gen
      this.timeout(100000)

      TheWatcher.utils.server.setup(serverConf, function (err) {
        if (err) {
          next(err)
        } else {
          next()
        }
      })
    })

    it('TheWatcher start in server mode', function (next) {
      // Start TheWatcher in server mode
      server.start()
      next()
    })
  })

  describe('Client', function () {
    it('generate client config & keys', function (next) {
      // Set timeout to prevent default timeout on key gen
      this.timeout(100000)

      TheWatcher.utils.client.setup(clientConf, function (err) {
        if (err) {
          next(err)
        } else {
          next()
        }
      })
    })

    // Planned to fail (Not in server DB)
    it('start in client mode', function (next) {
      this.timeout(10000)
      // Start TheWatcher in client mode
      client.start()
      next()
    })

    it('should be unauthorized connecting to server', function (next) {
      client.on('status', function (err) {
        err.message.should.be.eql('Client not found')
        next()
      })
    })

    it('add client to server', function (next) {
      TheWatcher.manage.add.client('./conf', next)
      // next()
    })

    it('should get duplicate client', function (next) {
      this.timeout(10000)
      // Start TheWatcher in client mode
      client.start()

      client.on('status', function (err, status) {
        err.message.should.be.eql('Authentication error - Duplicate Client!')
        next()
      })
    })

  after(function () {
    server.close()
  })
})
