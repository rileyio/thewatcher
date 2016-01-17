/*eslint no-process-exit: 2*/

var Database = require('./../../db/database')
var Utils = require('./../utils')
var fs = require('fs')
var path = require('path')

var Manage = module.exports

/**
 * Used in manage to prep the Config & DB for the manage tasks.
 * Default will run the conf loader on default server.json.
 * @param {object} [conf] - Optional, pass custom conf Obj.
 */
Manage.prep = function () {
  var self = this

  // Optionally if config is passed
  self.conf = (typeof arguments[0] === 'object')
    ? arguments[0] && console.log(arguments[0])
    : Utils.server.load.config('server')

  // Setup Primary DB
  self.DB = new Database(self.conf.db)
}

/**
 * Runs DB migration.
 * @param {callback} cb - Optional callback, called after migrate.
 */
Manage.setupDB = function (cb) {
  var self = this
  self.prep()

  // Setup Primary DB
  self.DB = new Database(self.conf.db)
  self.DB.setup(cb)
}

/**
 * Adds a client.json to the database - Helper to Database.client.add
 * @param {string} confPath - Location of the .json config file to add.
 * @param {callback} cb - Optional callback, called after DB add.
 */
Manage.add = {
  client: function (confPath, callback) {
    // Call prep
    Manage.prep()

    // Load client.json to add to clients table
    var clientConfig = Utils.client.load.config('client', confPath)

    Manage.DB.client.add(clientConfig, function (err, ret) {
      // Optional callback reutrn if callback is requested.
      if (typeof callback === 'function') return callback(err, ret)

      // No callback but throw error (example when used: cli)
      if (err) throw new Error(err)
    })
  }
}

Manage.export = {
  client: function (args) {
    console.log(args)
    // Load client.json
    var clientConfig = Utils.client.load.config('client')

    // Path to save to
    var targetSavePath = path.join(args._[0], 'client.json')

    // Perform export to supplied path
    fs.writeFile(targetSavePath, JSON.stringify(clientConfig), function (err) {
      if (err) throw err
      console.log('Client Config Exported to:', targetSavePath)
      process.exit(0)
    })
  }
}
