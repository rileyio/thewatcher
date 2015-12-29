var knex = require('knex');
var path = require('path');

module.exports = function (config) {
	var connection = knex({
		client: config.type,
		// debug: true,
		connection: {
			host: config.host,
			user: config.user,
			password: config.pass,
			database: config.database
		},
		migrations: {
			directory: path.join(__TW, 'migrations')
		}
	});
	
	connection.raw('SELECT 1+1 AS result')
		.return() // Return if not any errors
		.then(function () {
			console.log('TheWatcher >> Server >> DB::Connected!'.green)
		})
		.catch(function (err) {
			console.log('Check DB credentials/connection'.red);
			process.exit(1)
		})

	return connection;

}
