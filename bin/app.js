// #TheWatcher
// By #TheDoxMedia
//
// Main js file for loading the project.
// 
// Running: node index.js -c <path to config file>
var path = require('path');
var extend = require('xtend');
var Utils = require('./utils/utils');

var TheWatcher = function () {
	var self = this;
	
	// Set TheWatcher running Dir under __TW
	global.__TW = path.resolve(__dirname + '/..');

	// Check if TheWatcher was called via require('app')
	// Or via $ thewatcher {args}
	self.cmd = (require.main);
	
	self.mode = undefined;
	self.config = {
		silent: false
	};
	self.utils = Utils;
}

TheWatcher.prototype.client = function(){
	Utils.client.verify(function(validConfig) {
		console.log('TheWatcher >> Client >> Starting..'.yellow);

		// Load Client.js File
		var Client = require('./client/client');

		Client.start(validConfig);
	});
};

TheWatcher.prototype.server = function(){
	var self = this;
	
	// Load server config
	self.config = extend(Utils.server.load.config(), self.config);

	// Load server config JSON & pass to Server Core
	require('./server/server').start(self.config);
}

module.exports = TheWatcher;