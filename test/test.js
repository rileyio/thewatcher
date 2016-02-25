/* global done */
/* global describe, before, after, it */

var TheWatcher = require('../bin/app')
var should = require('should')

describe('Loading TheWatcher', function () {
  process.env.NODE_ENV = 'test'
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
    name: 'TheWatcher-Test Client',
    server: '127.0.0.1:9905',
    lat: '0.0',
    lon: '0.0',
    interval: 1000
  }

  after(function () {
    server.close()
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

    it('db migration', function (done) {
      TheWatcher.manage.setupDB(done)
    })

    it('TheWatcher start in server mode', function (done) {
      this.timeout(10000) // Give up to 10 seconds

      // Start TheWatcher in server mode
      server.start(done)
    })
  })

  describe('Client', function () {
    it('generate client config & keys', function (done) {
      // Set timeout to prevent default timeout on key gen
      this.timeout(100000)

      TheWatcher.utils.client.setup(clientConf, function (err) {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    })

    // Planned to fail (Not in server DB)
    it('start in client mode', function (done) {
      this.timeout(10000)
      // Start TheWatcher in client mode
      client.start()
      done()
    })

    it('should be unauthorized connecting to server', function (done) {
      client.on('status', function (err) {
        // console.log(err.message)
        err.message.should.be.eql('Client not found')
        done()
      })
    })

    it('add client to server', function (done) {
      TheWatcher.manage.add.client('./conf', function () {
        done()
      })
    })

    // it('should get duplicate client', function (done) {
    //   this.timeout(10000)
    //   // Start TheWatcher in client mode
    //   client.start()

  //   client.on('status', function (err, status) {
  //     err.message.should.be.eql('Authentication error - Duplicate Client!')
  //     done()
  //   })
  // })
  })
})
