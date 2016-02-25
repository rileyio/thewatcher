var winston = require('winston')
var path = require('path')
var fs = require('fs')
var os = require('os')

var Env = process.env

/**
 * Setup the logger
 * @param {String} name - This will be inherited as the name.
 */
var Logger = module.exports = function (name) {
  var self = this

  self.name = name + '.log'
  self.level = Env.TW_LOG || 'info'
  self.silent = (Env.NODE_ENV === 'test') ? true : false
  self.location = path.join(Env.PWD, 'logs')
  self.fullPath = path.join(self.location, self.name)

  // Log size before rollover, Default 2MB (23068672 bytes)
  self.logSize = 2097152

  // Max number of logs @ logSize, Default 2
  self.maxLogs = 2

  // Verify directory existance
  if (!logDirExists(self.location)) {
    // Create it
    fs.mkdirSync(self.location)
  }

  // Setup Winston
  self.log = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: self.level,
        silent: self.silent
      }),
      new (winston.transports.File)({
        filename: self.fullPath,
        level: self.level,
        maxsize: self.logSize,
        maxFiles: self.maxLogs,
        timestamp: true,
        json: false,
        showLevel: true,
        tailable: true,
        formatter: function (args) {
          // Return string will be passed to logger.
          return new Date().toLocaleString() + ' ' + args.level.toUpperCase() + ' ' + (undefined !== args.message ? args.message : '') +
          (args.meta && Object.keys(args.meta).length ? '\n\t' + JSON.stringify(args.meta) : '')
        }
      })
    ]
  })

  // Read logs daily - Adding these.
  // Add new line in log to seperate previous instance log.
  self.manual(`
---------------------------------------------------
TheWatcher
  Logger -> Level: ${self.level} -> Size: ${toMB(self.logSize)}MB -> Keep: ${self.maxLogs}
  Local Time -> ${new Date()}
  Local Time -> ${new Date().toUTCString()}
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

/**
 * For converting bytes to MB.
 * @param {Number} num - Size in bytes.
 */
function toMB (num) {
  return (num / 1024 / 1024)
}

/**
 * Ensure logs directory exists.
 * @param {Number} num - Size in bytes.
 * @returns {Boolean} - True: Dir Exists, False: Does not.
 */
function logDirExists (dir) {
  try {
    fs.statSync(dir)
  } catch (error) {
    return false
  }

  return true
}
