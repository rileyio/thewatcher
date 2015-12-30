var ClientQueries = require('./queries/client')

var Database = function (config) {
  var self = this

  self.config = config
  self.DB = require('./connection/connect')(self.config)

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
      console.log('Migration Complete.')
      process.exit(0)
    })
    .catch(function (err) {
      console.log('err', err)
      process.exit(1)
    })
}

module.exports = Database
