var fs = require('fs');
var keyReader = require('./key-reader');
var path = require('path');

// Function subset for validating
module.exports = function(callback) {
	
	console.log('Checking for config file..'.grey);

	fs.readFile(path.join(__NW, 'conf/client.json'), function(err, data) {
		if (err) throw err;
		var config = JSON.parse(data.toString());

		// Load PGP keys
		// config.key = array of key paths
		config.key = keyReader(config.key);

		// console.log(config.key);

		console.log('NightWatch >> Client >> Config loaded!'.green);

		// Callback with Valid Config
		callback(config);

	});
};