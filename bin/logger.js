var winston = require('winston')
var path = require('path')
var fs = require('fs')
var os = require('os')

var Env = process.env

/**
 * Setup the logger
 * @param {any} name - This will be inherited as the name.
 * @param {any} location - Logs directory.
 */
var Logger = module.exports = function (name, level) {
  var self = this

  self.name = name + '.log'
  self.level = level
  self.location = (arguments[2] !== undefined) ? arguments[2] : path.join(Env.PWD, 'logs')
  self.fullPath = path.join(self.location, self.name)

  // Log size before rollover, Default 2MB (23068672 bytes)
  self.logSize = 2097152

  // Max number of logs @ logSize, Default 2
  self.maxLogs = 2

  // Verify directory existance
  fs.stat(self.location, function (err, stats) {
    if (err) {
      // The ./logs dir does not exist
      if (err.code === 'ENOENT') {
        // Create it
        fs.mkdirSync(self.location)
      } else { // Different error, throw
        console.log(err.message.red)
        process.exit(1)
      }
    }
  })

  // Setup Winston
  self.log = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: self.level
      }),
      new (winston.transports.File)({
        filename: self.fullPath,
        level: self.level,
        maxsize: self.logSize,
        maxFiles: self.maxLogs,
        timestamp: true,
        json: false,
        showLevel: true,
        tailable: true
      })
    ]
  })

  // Read logs daily - Adding these.
  // Add new line in log to seperate previous instance log.
  self.manual(`
--------------------------------------------------
TheWatcher
  Logger -> Level: ${self.level} -> Size: ${toMB(self.logSize)}MB -> Keep: ${self.maxLogs}
  Local Time -> ${Date()}
  System -> ${os.platform()} -> Release: ${os.release()}

`)

  self.log.cli()
}

// Manual append to log
// Reserving for start up lines.
Logger.prototype.manual = function (text) {
  var self = this

  return fs.appendFileSync(self.fullPath, text, 'utf8')
}

function toMB (num) {
  return (num / 1024 / 1024)
}
