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

		// Load PGP key
		config.key = keyReader(config.keyPath);

		console.log('NightWatch >> Client >> Config loaded!'.green);

		// Callback with Valid Config
		callback(config);

	});
}
