var Client = require('./queries/client');

var Database = function (config) {
	var self = this;

	self.config = config;
	self.DB = require('./connection/connect')(self.config);

	self.client = new Client(self.DB);
}

module.exports = Database;