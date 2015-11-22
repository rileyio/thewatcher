// #NightWatch
// By #TheDoxMedia
//
// Main js file for loading the project.
// 
// Running: node index.js -c <path to config file>
var config = require('./../conf/config');
var args = require('args');
var Utils = require('./utils/utils');

exports.init = function() {
	// Check for mode being started in..
	var options = args.Options.parse([
		config.args.mode,
		config.args.config,
		config.args.utils.add
	]);
	var parsedStartArgs;

	// Gather given cl args and pass to args parser
	// try {
		parsedStartArgs = args.parser(process.argv).parse(options);

		// Run start()
		start(parsedStartArgs);
	// } catch (err) {
		// console.log('NightWatch::Error >> Invalid args..')
	// }
};

function start(pArgs) {
	// try {
	// If a -m (mode) is passed
	if (pArgs.mode) {
		console.log(pArgs)

		Utils.mode(pArgs.mode);


		// Load client data into global.client.* for Client.js
		// global.client = JSON.parse(data.toString());
		// switch (config.mode) {
		// 	case 'client':
		// 		// Run validate against the client config
		// 		// 	to ensure it has a home & port set..
		// 		Utils.validate.client.config(config, function(confValid) {
		// 			console.log('NightWatch >> Client >> Starting..');
		// 			// Load Client.js File
		// 			var Client = require('./core/Client');
		// 			Client.start(confValid);
		// 		});
		// 		break;
		// 	case 'server':
		// 		var Server = require('./core/Server');
		// 		Server.start(config);
		// 		break;
		// }
		// if (pArgs.add) {
		// 	Utils.add(pArgs.add);
		// }
		// } catch (err) {
		// 	console.log(err);
		// }
	}
}