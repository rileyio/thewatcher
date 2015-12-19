// #NightWatch
// By #TheDoxMedia
//

module.exports = {
	client: {
		setup: require('./client/setup'),
		verify: require('./client/verify'),
		verifyServer: require('./client/verify-server')
	},
	server: {
		add: require('./server/verify'),
		load: {
			config: require('./server/config-loader'),
		},
	},
	mode: require('./Mode'),
	config: require('./Config')
};
