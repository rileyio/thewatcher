// Default Server Config
module.exports = {
  // Human Name for the Server
  name: undefined,

  // A sha512 combining the current time and name
  id: undefined,

  // Server Latitude
  lat: undefined,

  // Server Longitude
  lon: undefined,

  // UNIX timestamp of Server creation
  created_at: 0,

  // Basic Mode string
  mode: 'server',

  // Port for listening
  // Default: 9905
  port: 9905,

  // PGP Key path (Generated during `node index.js -s server`)
  key: {
    public: {
      path: undefined
    },
    private: {
      path: undefined
    }
  },
  db: {
    type: undefined,
    host: undefined,
    database: undefined,
    user: undefined,
    pass: undefined
  }
}
