// #NightWatch
// By #TheDoxMedia
//
// Main js file for loading the project.
// 
// Running: node index.js -c <path to config file>
var config = require('./../conf/config');
var args = require('args');
var path = require('path');
var Utils = require('./utils/utils');

exports.init = function() {
	// Check for mode being started in..
	var options = args.Options.parse([
		config.args.mode,
		config.args.config,
		config.args.add
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
	console.log(pArgs);

	// Set globals
	global.NightWatch = {
		name: 'NightWatch',
		version: '0.0.2',
		path: {
			resources: path.resolve(__dirname + '/..') + '/resources'
		},
	};
	
	// Setup ENV vars
	process.env.NW_INSTALL_DIR = path.resolve(__dirname + '/..');


	if (pArgs.mode) {
		Utils.mode(pArgs.mode);
	}

	if (pArgs.config) {
		Utils.config(pArgs.config);
	}
}