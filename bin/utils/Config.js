var ClientSetup = require('./client/setup');
var ServerSetup = require('./server/setup');
var fs = require('fs');

module.exports = function(config) {
	// Called by {NightWatch} -c client
	switch (config) {
		case 'client':
			ClientSetup();
			break;
	}
	
	// Called by {NightWatch} -c server
	switch (config) {
		case 'server':
			ServerSetup();
			break;
	}
};
