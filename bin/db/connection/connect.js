var knex = require('knex')
var path = require('path')

// Shorten proc.env
var Env = process.env

module.exports = function (log, config) {
  var connection = knex({
    client: config.type,
    // debug: true,
    connection: {
      host: config.host,
      user: config.user,
      password: config.pass,
      database: config.database,
      charset: 'utf8'
    },
    migrations: {
      directory: path.join(Env.PWD, 'migrations')
    }
  })

  connection.raw('SELECT 1+1 AS result')
    .return() // Return if not any errors
    .then(function () {
      log.verbose(`Database connection established host:${config.host}`)
    })
    .catch(function (err) {
      if (err) throw err
      log.error(`Database Connection Error: Check credentials/connection)`)
      process.exit(1)
    })

  return connection
}
