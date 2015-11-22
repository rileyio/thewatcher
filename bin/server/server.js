// #NightWatch
// By #TheDoxMedia
// Server.js
// 
// Server Spawner

console.log('NightWatch>>Server :: Starting up..');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Datastore = require('nedb'),
	db = {
		clients: new Datastore({
			filename: './DB_NightWatch_Server__Clients.db',
			autoload: true
		}),
		checkins: new Datastore({
			filename: './DB_NightWatch_Server__Checkins.db',
			autoload: true
		})
	};

exports.start = function(args) {

	app.use(bodyParser.json());

	// Post to ADDR:PORT
	app.post('/', function(req, res) {
		// Debugging..
		// console.log(req.body)

		// Validate user
		validate_client(req.body.name, req.body.id, function(resp) {
			if (resp) { // If the client is active and valid 
				console.log(' :: Client >> \'' + req.body.name + '\' << VALID!');

				// Save to DB
				db.checkins.insert(req.body, function(err, newDoc) {
					if (err) throw err;
					console.log(' :: Client >> Saved to DB >> Checkin for \'' + req.body.name + '\'');

					// Reply to client..
					res.send(JSON.stringify({
						checkin: 'successful',
						valid: true
					}));
				});
			} else { // Client !VALID
				console.log(' :: Client >> \'' + req.body.name + '\' << NOT VALID!')

				// Reply to client..
				res.send(JSON.stringify({
					checkin: 'failed',
					err: 'Not a valid/registered client.',
					valid: false
				}));
			}
		});
	});

	// Start listening on defined ADDR:PORT for Posts
	var server = app.listen(args.port, function() {
		var host = server.address().address;
		var port = server.address().port;

		console.log('NightWatch >> Listening @ http://%s:%s', host, port);
	});

	console.log('NightWatch >> Server >> Started!');

}

function validate_client(_name, _id, callback) {
	// Check the client DB for the client with
	// id, client (name), and if valid is set: true
	db.clients.findOne({
		name: _name,
		id: _id,
		valid: true
	}, function(err, doc) {
		callback(doc);
	});
}
