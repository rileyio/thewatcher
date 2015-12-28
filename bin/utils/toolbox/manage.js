var Database = require('./../../db/database');
var Utils = require('./../utils');

var Manage = function(){
	var self = this;
	
	// Load server config to access DB
	var config = Utils.server.load.config('server');
	
	// Setup Primary DB
	self.DB = new Database(config.db);
};

Manage.prototype.addClient = function(args){
	var self = this;
	// console.log(args)
	// console.log('Add Client');
	
	// Load client.json
	var clientConfig = Utils.client.load.config('client', args._);

	self.DB.client.add({
		name: clientConfig.name,
		pubkey: clientConfig.key.public
	})
};

module.exports = Manage;