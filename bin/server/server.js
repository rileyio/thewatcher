// #NightWatch
// By #TheDoxMedia
// Server.js
// 
// Server Spawner

console.log('NightWatch>>Server :: Starting up..');

// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
var Database = require('./../db/database');

exports.start = function(config) {

	// app.use(bodyParser.json());

	// Setup DB
	var DB = Database.connection(config.db);

	// // Post to ADDR:PORT
	// app.post('/', function(req, res) {
	// 	// Debugging..
	// 	// console.log(req.body)

	// 	// Validate user
	// 	validate_client(req.body.name, req.body.id, function(resp) {
	// 		if (resp) { // If the client is active and valid 
	// 			console.log(' :: Client >> \'' + req.body.name + '\' << VALID!');

	// 			// Save to DB
	// 			db.checkins.insert(req.body, function(err, newDoc) {
	// 				if (err) throw err;
	// 				console.log(' :: Client >> Saved to DB >> Checkin for \'' + req.body.name + '\'');

	// 				// Reply to client..
	// 				res.send(JSON.stringify({
	// 					checkin: 'successful',
	// 					valid: true
	// 				}));
	// 			});
	// 		} else { // Client !VALID
	// 			console.log(' :: Client >> \'' + req.body.name + '\' << NOT VALID!')

	// 			// Reply to client..
	// 			res.send(JSON.stringify({
	// 				checkin: 'failed',
	// 				err: 'Not a valid/registered client.',
	// 				valid: false
	// 			}));
	// 		}
	// 	});
	// });

	// // Start listening on defined ADDR:PORT for Posts
	// var server = app.listen(config.port, function() {
	// 	var host = server.address().address;
	// 	var port = server.address().port;

	// 	console.log('NightWatch >> Listening @ http://%s:%s', host, port);
	// });

	// console.log('NightWatch >> Server >> Started!');

}