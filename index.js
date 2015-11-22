// #NightWatch
// By #TheDoxMedia
//
// Main js file for loading the project.
// 
// Running: node index.js -c <path to config file>

// Set NightWatch global
global.NW = {
	name: 'NightWatch',
	version: '0.0.1'
}

var args = require('args');
var fs = require('fs');
var Utils = require('./core/Utils');

// Check for mode being started in..
var options = args.Options.parse([{
	name: 'config',
	shortName: 'c',
	type: 'string',
	help: 'n/a'
}, {
	name: 'add',
	shortName: 'a',
	type: 'string',
	help: 'n/a'
}]);

var parsedStartArgs;

try {
	parsedStartArgs = args.parser(process.argv).parse(options);
} catch (err) {
	console.log('NightWatch::Error >> Invalid args..')
}

try {
	if (parsedStartArgs.config) {
		// Read given config file
		fs.readFile(parsedStartArgs.config, function(err, data) {
			if (err) throw err;
			var config = JSON.parse(data.toString());
			// Load client data into global.client.* for Client.js
			// global.client = JSON.parse(data.toString());
			switch (config.mode) {
				case 'client':
					// Run validate against the client config
					// 	to ensure it has a home & port set..
					Utils.validate.client.config(config, function(confValid){
						console.log('NightWatch >> Client >> Starting..');
						// Load Client.js File
						var Client = require('./core/Client');

						Client.start(confValid);
					});

					break;
				case 'server':
					var Server = require('./core/Server');

					Server.start(config);

					break;
			}


		});
	}
	if (parsedStartArgs.add) {
		Utils.add(parsedStartArgs.add);
	}
} catch (err) {
	console.log(err);
}
