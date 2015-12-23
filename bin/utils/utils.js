// #NightWatch
// By #TheDoxMedia
//

module.exports = {
	client: {
		setup: require('./client/setup'),
		verify: require('./client/verify'),
		verifyServer: require('./client/verify-server'),
		sign: require('./client/sign')
	},
	server: {
		add: require('./server/verify'),
		setup: require('./server/setup'),		
		verifySig: require('./server/verify-sig'),		
		load: {
			config: require('./server/config-loader'),
		},
	}
};
