// #NightWatch
// By #TheDoxMedia
// Client.js
// 
// Client Spawner.. Used for spawning a new child to the
// NightWatch server.

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Utils = require('./../utils/Utils');

exports.start = function(config) {
	app.use(bodyParser.json());
	// Post to ADDR:PORT
	app.post('/', function(req, res) {
		// Debugging..
		console.log(req.body)
		console.log(' :: Client >> \'' + req.body.name + '\' << NOT VALID!');

		Utils.client.verifyServer(req, config, function(resp) {
			// Reply to client..
			res.send(resp);
		});

	});

	// Start listening on defined ADDR:PORT for POST requests
	var server = app.listen(config.port, function() {
		var host = server.address().address;
		var port = server.address().port;

		console.log('NightWatch >> Listening @ http://%s:%s', host, port);
	});

	console.log('NightWatch >> Client >> Started!'.green);

}
