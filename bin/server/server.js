// #NightWatch
// By #TheDoxMedia
// Server.js
// 
// Server Spawner

console.log('NightWatch >> Server :: Starting up..');

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var Database = require('./../db/database');


exports.start = function(config) {

	app.use(bodyParser.json());

	// Setup DB
	var DB = Database.connection(config.db);

	// Listen for start of handshakes from clients
	app.get('/connect', function(req, res, next) {
		res.send({
			status: 'connected'
		});
	});


	// Socket [Connection] listening
	io.on('connection', function(socket) {
		console.log('a user connected');

		socket.broadcast.emit('hi');
		socket.on('connect', function() {
			console.log(' Connection Made!');
		});
	});


	// Initaialize Socket IO with given port in server config
	var expressServer = app.listen(config.port, function() {
		var host = expressServer.address().address;
		var port = expressServer.address().port;

		// Good to listen
		// Print successful startup
		console.log('NightWatch >> Listening @ //%s:%s', host, port);
	});


};