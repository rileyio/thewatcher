// #NightWatch
// By #TheDoxMedia
// Client.js
// 
// Client Spawner.. Used for spawning a new child to the
// NightWatch server.

// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
var io = require('socket.io-client');
var os = require('os');

var Utils = require('./../utils/Utils');


exports.start = function (config) {
	var socket = io.connect('http://' + config.server, {
		'forceNew': true,
	});
	

	socket.on('connect', function (sio) {
		var prepMsg = JSON.stringify({
			session: socket.id,
			name: config.name
		});

		Utils.client.sign(config.key.private, prepMsg, function (signed) {
			// console.log(signed);
			
			socket.emit('authentication', {
				name: config.name,
				signed: signed
			});
		});
	});

	socket.on('authenticated', function () {
		console.log('Socket Connected!');

		HeartBeat();
	});

	socket.on('unauthorized', function (err) {
		console.log("There was an error with the authentication:", err.message);
	});

	socket.on('reconnecting', function (attempt) {
		console.log('Reconnecting', attempt);
	});

	socket.on('disconnect', function () {
		console.log('Socket Disconnect!');
	});

	socket.on('error', function (err) {
		console.log('Error:', err);
	});

	console.log('NightWatch >> Client >> Started!'.green);

	// });
	
	function HeartBeat() {

		var id = Math.floor((Math.random() * 100) + 1);

		setInterval(function () {
			var heartbeatTime = Date.now();

			// console.log(config);

			socket.emit('client-heartbeat', {
				name: config.name,
				time: heartbeatTime,
				data: HeartBeatData()
			});
		}, 2000);

	}

	function HeartBeatData() {
		return JSON.stringify({
			uptime: os.uptime(),
			memory: {
				free: os.freemem()
			},
			cup: {
				loadavg: os.loadavg()
			}
		});
	}

}