// #NightWatch
// By #TheDoxMedia
// Client.js
// 
// Client Spawner.. Used for spawning a new child to the
// NightWatch server.

var http = require('http');

exports.start = function(args) {
	// Send first right away
	send_update(args);

	setInterval(function(){
		send_update(args);
	}, args.interval);
}

function send_update(args){
	// Build _target
	var _target = {
		_addr: args.home,
		_port: args.port
	};

	var svrReturn = {
		server: global.NW.server,
		version: global.NW.version,
		name: args.name,
		id: args.id,
		time: Math.floor(Date.now() / 1000)
	};

	svrReturnSTR = JSON.stringify(svrReturn);

	console.log('NightWatch::Send >> ' + _target._addr + ':' + _target._port);

	var sendPOST = http.request({
		host: _target._addr,
		port: _target._port,
		path: '/',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-length': svrReturnSTR.length
		}
	}, function(resp) {
		resp.on('end', function() {

			console.log(' >> Update Successful!');
		});
	});

	// Make POST
	sendPOST.write(svrReturnSTR);
	sendPOST.end();
}