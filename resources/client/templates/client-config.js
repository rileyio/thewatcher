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

	// Host/IP/Addr to the server
	server: undefined,

	// UNIX timestamp of client creation
	createTime: 0,

	// Basic Mode string
	mode: 'client',

	// [Deprecated] Communication port
	// port: 0,
	
	// PGP Key path (Generated during `node index.js -c client`)
	key: {
		public: {
			path: undefined,
		},
		private: {
			path: undefined,
		}
	}
};