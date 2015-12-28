var Database = require('./../../db/database');
var Utils = require('./../utils');
var fs = require('fs');
var path = require('path');

var Manage = function () {
	var self = this;
	
	// Load server config to access DB
	var config = Utils.server.load.config('server');
	
	// Setup Primary DB
	self.DB = new Database(config.db);
};

Manage.prototype.addClient = function (args) {
	var self = this;
	
	// Load client.json
	var clientConfig = Utils.client.load.config('client', args._);

	self.DB.client.add({
		name: clientConfig.name,
		pubkey: clientConfig.key.public
	})
};

Manage.prototype.exportClientConf = function (args) {
	var self = this;
	
	// Load client.json
	var clientConfig = Utils.client.load.config('client');

	// Path to save to
	var targetSavePath = path.join(args._[0], 'client.json'); 

	// Perform export to supplied path
	fs.writeFile(targetSavePath, JSON.stringify(clientConfig), function (err) {
		if (err) throw err;
		console.log('Client Config Exported to:', targetSavePath);
		process.exit(0);
	});
};

module.exports = Manage;