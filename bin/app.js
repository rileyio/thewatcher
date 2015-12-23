// #NightWatch
// By #TheDoxMedia
//
// Main js file for loading the project.
// 
// Running: node index.js -c <path to config file>
var appConf = require('./../conf/app');
var path = require('path');
var Utils = require('./utils/utils');

var NightWatch = function () {
	var self = this;
	
	// Set NightWatch running Dir under __NW
	global.__NW = path.resolve(__dirname + '/..');

	// Check if NightWatch was called via require('app')
	// Or via $ nightwatch {args}
	self.cmd = (require.main);
	
	self.mode = undefined;
	self.conf = {};
	self.utils = Utils;
}

NightWatch.prototype.client = function(){
	Utils.client.verify(function(validConfig) {
		console.log('NightWatch >> Client >> Starting..'.yellow);

		// Load Client.js File
		var Client = require('./client/client');

		Client.start(validConfig);
	});
};

NightWatch.prototype.server = function(){
	// Load server config JSON & pass to Server Core
	require('./server/server').start(Utils.server.load.config());
}

module.exports = NightWatch;