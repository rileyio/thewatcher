// Default Client Config
module.exports = {
	// Human Name for the client
	name: undefined,

	// A sha512 combining the current time and name
	id: undefined,

	// Client Latitude
	lat: undefined,

	// Client Longitude
	lon: undefined,

	// Home server (to call back to)
	server: undefined,

	// UNIX timestamp of client creation
	createTime: 0,

	// Basic Mode string
	mode: 'client',

	// Port for listening
	// Default: 3306
	port: 3306,

	// PGP Key path (Generated during `node index.js -s server`)
	key: {
		public: {
			path: undefined,
		},
		private: {
			path: undefined,
		}
	}
};
