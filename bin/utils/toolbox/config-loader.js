/* global __TW */
var fs = require('fs')
var keyReader = require('./key-reader')
var path = require('path')

module.exports = function (type) {
  var configPath // undefined

  // Optional path w/override to default ./conf/{type}.json
  var optPath = (arguments[1] !== undefined ? arguments[1] : undefined)

  // Default config location and name based off type
  var defaultPath = path.join(__TW, 'conf/', type + '.json')

  // Optional override of configPath if arguments[1] is set.
  // Set config path
  configPath = (optPath === undefined ? defaultPath : optPath)

  // Check if {type}.json is already in path
  if (!/^(.*\.json)$/i.test(configPath)) {
    // Update path to incluse {type}.json
    configPath = path.join(configPath, type + '.json')
  }

  // Wrapped in try to throw config loading error if files does not exist.
  try {
    var config = fs.readFileSync(configPath)

    // Run through JSON.parse
    var configParsed = JSON.parse(config.toString())

    // Load PGP keys
    // config.key = array of key paths or possibly the raw key
    // checking first if its a raw key
    // Difference between:
    //    Exported .json  Arr.key.pub.path will NOT exist
    //    Copied .json    Arr.key.pub.path will conatin a path
    if (configParsed.key.private.path !== undefined) {
      configParsed.key = keyReader(configParsed.key, type)
    }
    // ELSE, This is an exported json and just return the inline values
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Config missing ( conf/%s.json )'.red, type)
      process.exit(0)
    } else {
      console.log('err'.red, error)
    }
  }

  // Return parsed config
  return configParsed
}
