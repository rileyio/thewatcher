// #NightWatch
// By #TheDoxMedia
// Server.js
// 
// Server Spawner

console.log('NightWatch >> Server :: Starting up..');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Express middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// Databases
var Loki = require('lokijs');
var Database = require('./../db/database');

exports.start = function (config) {

	// Access NightWatch global
	// var NW = global.NW;

	// Setup Primary DB
	var DB = Database.connection(config.db);
	
	// Setup MemDB
	var MemDB = new Loki('loki.json');
	var Heartbeats = MemDB.addCollection('heartbeats');

	// Clients running array
	var stats = {
		connected: 0
	};

	// Listen for start of handshakes from clients
	app.get('/', function (req, res) {
		// Send local server monitoring panel
		res.sendFile(__NW + '/resources/server/www/index.html');
		// if (!req.user) {
		// 	res.send(401);
		// } else {
		// 	res.json(req.user);
		// }
	});
	
	// Initaialize Socket IO with given port in server config
	var expressServer = http.listen(config.port, function () {
		var host = expressServer.address().address;
		var port = expressServer.address().port;

		// Good to listen
		// Print successful startup
		console.log('NightWatch >> Listening @ //%s:%s', host, port);
	});

	////////////////////////////////////////////////////////////////
	/////  Socket.IO Below /////////////////////////////////////////
	
	require('socketio-auth')(io, {
		authenticate: function (socket, data, callback) {
			console.log('Socket IO Auth');

			var username = data.username;
			var password = data.password;

			if (password === 'test') {
				return callback(null, password);
			}
			else {
				return callback(new Error("User not found"));
			}
		},
		postAuthenticate: function (socket, data) {
			console.log('Socket IO POSTAuth');

			var username = data.username;
			socket.client.user = username;
			
			// Check if client is in the heartbeats MemDB
			var inMemDB = Heartbeats.findOne({ name: username });
			
			// Add client to heart beats array
			if (!inMemDB){
				console.log('NightWatch >> Server >> MemDB::Heartbeats(add:%s)', username);
				
				Heartbeats.insert({
					name: username,
					data: {}
				});
			}
			
			stats.connected++;
			sendStats();

			socket.on('client-heartbeat', function (heartbeat) {
				// Update heartbeat mem db
				var update = Heartbeats.findOne({ 'name': heartbeat.name });
				
				// console.log(Heartbeats.data);
				// console.log(heartbeat.name);
				// console.log(update);
				
				update.data = heartbeat.data;
				
				// console.log(update);
			});

			socket.on('server-stats', function (heartbeat) {
				socket.emit('server-stats', stats);
				// sendStats();
			});

			socket.on('disconnect', function (heartbeat) {
				stats.connected--;
				sendStats();
			});

			// Side note: need to spawn or track admins for stats
			// and send data
			function sendStats() {
				console.log('Send Stats Called..');
	
				// console.log(Heartbeats.findOne({ name: socket.client.user }));			
				
				if (username === 'admin') {
					console.log('Send Stats To Admin!');
					io.to(socket.id).emit('server-stats', {
						stats: stats,
						heartbeats: Heartbeats.data
					});

				}
			}

		},
	});
};
