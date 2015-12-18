var knex = require('knex');

module.exports = function (config) {
	var connection = knex({
		client: config.type,
		connection: {
			host: config.host,
			user: config.user,
			password: config.pass,
			database: config.database
		}
	});

	return connection;
}
