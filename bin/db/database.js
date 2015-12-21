var Client = require('./queries/client');

var Database = function (config) {
	var self = this;

	self.config = config;
	self.DB = require('./connection/connect')(self.config);

	self.client = new Client(self.DB);
}

Database.prototype.newClient = function (data, callback) {
	var self = this;

	self.DB('clients')
		.insert({
			name: data.username,
			session: data.session,
			pubkey: 12312
		}).then(callback)
}

Database.prototype.save = function () {
	var self = this;
	var opts = {
		client: function (data) {

			self.DB('clients')
				.insert({
					name: data.username,
					session: 123,
					pubkey: 12312
				}).then(function (ret) {
					console.log(ret)
				})

		}
	};

	return opts;
}

module.exports = Database;