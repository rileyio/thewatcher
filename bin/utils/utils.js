// #TheWatcher
// By #TheDoxMedia
//

// Universal/Toolbox (Not server or client specific)
var configLoader = require('./toolbox/config-loader')
var pgpMsgSign = require('./toolbox/sign')
var id = require('./toolbox/id')

// Server specific
var server_setup = require('./server/setup')
var server_verifySig = require('./server/verify-sig')

// Client specific
// var client_verifyServer = require('./client/verify-server')
var client_setup = require('./client/setup')

module.exports = {
  client: {
    setup: client_setup,
    // verifyServer: client_verifyServer,
    sign: pgpMsgSign,
    load: {
      config: configLoader
    }
  },
  server: {
    setup: server_setup,
    verifySig: server_verifySig,
    load: {
      config: configLoader
    }
  },
  id: id
}
