// Default Client Config
module.exports = {
  // Human Name for the client
  name: undefined,

  // A sha512 combining the current time and name
  id: undefined,

  // Data update interval to server
  interval: undefined,

  // Client Latitude
  lat: undefined,

  // Client Longitude
  lon: undefined,

  // Home server (to call back to)
  server: undefined,

  // UNIX timestamp of client creation
  created_at: 0,

  // Basic Mode string
  mode: 'client',

  // PGP Key path (Generated during `node index.js -s server`)
  key: {
    public: {
      path: undefined
    },
    private: {
      path: undefined
    }
  }
}
