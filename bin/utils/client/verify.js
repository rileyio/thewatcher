// var crypto = require('crypto');
// var prompt = require('prompt');
var fs = require('fs');
var keyReader = require('./key-reader');

// Function subset for validating
module.exports = function(callback) {
	console.log('Checking for config file..'.grey);

	fs.readFile('client.json', function(err, data) {
		if (err) throw err;
		var config = JSON.parse(data.toString());

		// console.log(config)

		// Load PGP keys
		// config.key = array of key paths
		config.key = keyReader(config.key);

		// console.log(config.key);

		console.log('NightWatch >> Client >> Config loaded!'.green);

		// Callback with Valid Config
		callback(config);

	});
};