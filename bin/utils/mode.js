var Utils = require('./Utils');
// var NightWatch = require('./../../conf/app');

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
			// Load server config JSON & pass to Server Core
			require('./../server/server').start(Utils.server.load.config());

			break;
	}
};
