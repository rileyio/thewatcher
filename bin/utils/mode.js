var Utils = require('./Utils');
var app = require('./../../conf/app');

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
			// Load server config JSON
			var serverConfig = Utils.server.load.config();
		
			// Load Server Core
			require('./../server/server').start(app);

			break;
	}
};
