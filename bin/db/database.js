var ClientQueries = require('./queries/client');

var Database = function (config) {
	var self = this;

	self.config = config;
	self.DB = require('./connection/connect')(self.config);

	// Options ( DB.client.add, DB.server.. )
	self.client = new ClientQueries(self.DB);
}

module.exports = Database;