var Utils = require('./Utils');
var fs = require('fs');
var ServerConfig = require('./../../conf/config');

module.exports = function(mode) {
	switch (mode) {
		case 'client':
			Utils.client.verify(function(validConfig) {
				console.log('NightWatch >> Client >> Starting..'.yellow);

				// Load Client.js File
				var Client = require('./../client/Client');

				Client.start(validConfig);
			});

			break;

		case 'server':
			var Server = require('./../server/server');

			Server.start(ServerConfig);
			break;
	}
};
