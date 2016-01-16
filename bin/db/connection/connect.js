var knex = require('knex')
var path = require('path')

// Shorten proc.env
var Env = process.env

module.exports = function (log, config) {
  var connection = knex({
    client: config.type,
    // debug: true,
    connection: {
      host: Env.TW_DB_HOST || config.host,
      user: Env.TW_DB_USER || config.user,
      password: Env.TW_DB_PASS || config.pass,
      database: Env.TW_DB_NAME || config.database,
      charset: 'utf8'
    },
    migrations: {
      directory: path.join(Env.PWD, 'migrations')
    }
  })

  connection.raw('SELECT 1+1 AS result')
    .return() // Return if not any errors
    .then(function () {
      log.verbose(`Database connection established host:${Env.TW_DB_HOST || config.host}`)
    })
    .catch(function (err) {
      log.error(`Database Connection Error: Check credentials/connection)`)
      if (err) throw err
    })

  return connection
}
