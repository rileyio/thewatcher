var ClientQueries = require('./queries/client')
var Logger = require('./../logger')
var connection = require('./connection/connect')

var Database = module.exports = function (config) {
  var self = this

  // Setup logging
  self.log = new Logger('Database', 'silly').log

  self.config = config
  self.DB = connection(self.log, self.config)

  // Options ( DB.client.add, DB.server..)
  self.client = new ClientQueries(self.DB)
}

Database.prototype.checkTable = function (table, callback) {
  var self = this

  // Check if table exists
  self.DB.schema.hasTable(table)
    .then(callback)
}

Database.prototype.setup = function () {
  var self = this

  self.DB.migrate.latest()
    .then(function () {
      // return knex.seed.run()
      self.log.info('Migration Complete.')
      process.exit(0)
    })
    .catch(function (err) {
      self.log.error(err)
      process.exit(1)
    })
}
