var Utils = require('./utils');
var fs = require('fs');
var config = require('./../../conf/config');

module.exports = function(mode){
	switch (mode) {
		case 'client':

			// Run validate against the client config
			// 	to ensure it has a home & port set..
			Utils.validate.client.config(config, function(confValid) {
				console.log('NightWatch >> Client >> Starting..');
				// Load Client.js File
				var Client = require('./core/Client');
				Client.start(confValid);
			});
			break;

		case 'server':
			var Server = require('./../server/server');

			Server.start(config);
			break;
	}
};