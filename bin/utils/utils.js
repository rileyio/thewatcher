// #TheWatcher
// By #TheDoxMedia
//

var configLoader = require('./toolbox/config-loader');

module.exports = {
	client: {
		setup: require('./client/setup'),
		verifyServer: require('./client/verify-server'),
		sign: require('./client/sign'),
		load: {
			config: configLoader,
		},
	},
	server: {
		add: require('./server/verify'),
		setup: require('./server/setup'),		
		verifySig: require('./server/verify-sig'),		
		load: {
			config: configLoader,
		},
	}
};
