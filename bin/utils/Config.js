var ClientSetup = require('./client/setup');
var fs = require('fs');

module.exports = function(config) {
	switch (config) {
		case 'client':
			ClientSetup();
			break;
	}
};
