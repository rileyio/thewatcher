var ClientQueries = require('./queries/client')
var Logger = require('./../logger')
var connection = require('./connection/connect')

// Shorten proc.env
var Env = process.env

var Database = module.exports = function (config) {
  var self = this

  // Setup logging
  self.log = new Logger('Database', 'silly').log

  self.config = config
  self.DB = connection(self.config)

  // Options ( DB.client.add, DB.server..)
  self.client = new ClientQueries(self)
}

Database.prototype.ready = function (cb) {
  var self = this

  self.DB.raw('SELECT 1+1 AS result')
    .return() // Return if not any errors
    .then(function () {
      self.log.verbose(`Database connection established host:${Env.TW_DB_HOST || self.config.host}`)

      // cb(err, status)
      return cb(null, 'connected')
    })
    .catch(function (err) {
      self.log.error(`Database Connection Error: Check credentials/connection)`)
      return cb(err, 'disconnected')
    })
}

Database.prototype.checkTable = function (table, callback) {
  var self = this

  // Check if table exists
  self.DB.schema.hasTable(table)
    .then(callback)
}

Database.prototype.setup = function (cb) {
  var self = this

  self.DB.migrate.latest()
    .then(function () {
      // return knex.seed.run()
      self.log.info('Migration Complete.')
      typeof cb === 'function' ? cb(null, { status: 'Migration Complete.' }) : process.exit(0)
    })
    .catch(function (err) {
      self.log.error(err)
      typeof cb === 'function' ? cb(err) : process.exit(0)
    })
}
