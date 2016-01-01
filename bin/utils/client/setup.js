/* global __TW */

var crypto = require('crypto')
var prompt = require('prompt')
var fs = require('fs')
var openpgp = require('openpgp')
var path = require('path')

module.exports = function (calling) {
  // Load default config layout from template js
  var template = require(path.join(__TW, '/resources/client/templates/config'))

  var optional = arguments[0]
  var callback = arguments[1]

  var confDefaultPath = path.join(__TW, '/conf/')

  // Check for default config path (#2)
  fs.stat(__TW + '/conf/', function (err, stats) {
    if (err) {
      // The ./conf dir does not exist
      if (err.code === 'ENOENT') {
        // Create it
        fs.mkdirSync(confDefaultPath)
      } else { // Different error, throw
        console.log(err.message.red)
        process.exit(1)
      }
    }

    // Check that no paramaters passed to setup func
    // if (!Object.keys(optional).length) {
    if (!optional) {
      promptConfig(template)
    } else { // If a custom config is passed, skip prompts
      generate_key(optional, function (ret) {
        // Fillout template
        template.id = id_gen(optional.name)
        template.name = optional.name
        template.lat = optional.lat
        template.lon = optional.lon
        template.created_at = Date.now()
        template.port = optional.port
        template.key.private.path = ret.Private
        template.key.public.path = ret.Public

        // Database
        template.db.type = optional.db.type
        template.db.host = optional.db.host
        template.db.database = optional.db.database
        template.db.user = optional.db.user
        template.db.pass = optional.db.pass

        // With no error on key gen
        if (!ret.message) {
          create_json(template)
          callback()
        } else {
          callback(new Error(ret.message))
        }
      })
    }
  })
}

function create_json (data) {
  var confDefaultFile = path.join(__TW, 'conf/client.json')

  // Write client.json
  return fs.writeFile(confDefaultFile, JSON.stringify(data, null, '\t'))
}

function id_gen (name) {
  var shasum = crypto.createHash('sha512')
  var curTime = (Date.now() / 1000)

  shasum.update(name + '_' + curTime)

  return shasum.digest('hex')
}

function generate_key (userInput, callback) {
  var keysDefaultPath = path.join(__TW, '/conf/keys/')

  var options = {
    numBits: 2048,
    userId: userInput.name
  }

  // Check for default config/keys path (#2)
  fs.stat(keysDefaultPath, function (err, stats) {
    if (err) {
      // The ./conf/keys dir does not exist
      if (err.code === 'ENOENT') {
        // Create it
        fs.mkdirSync(keysDefaultPath)
      } else { // Different error, throw
        console.log(err.message.red)
        process.exit(1)
      }
    }

    openpgp.generateKeyPair(options)
      .then(function (keypair) {
        // Success
        var privkey = keypair.privateKeyArmored
        var pubkey = keypair.publicKeyArmored

        // Save keys to files
        // [PRI] {install}/conf/keys/PrivateKey.pgp
        fs.writeFileSync(path.join(__TW, 'conf/keys/PrivateKey'), privkey)

        // [PUB] {install}/conf/keys/PublicKey.pgp
        fs.writeFileSync(path.join(__TW, 'conf/keys/PublicKey.pgp'), pubkey)

        // Callback
        callback({
          Private: path.join(__TW, 'conf/keys/PrivateKey'),
          Public: path.join(__TW, 'conf/keys/PublicKey.pgp')
        })
      })
      .catch(function (err) {
        console.log(err)
      })
  })
}

function promptConfig (template) {
  // Get user input
  prompt.message = ''
  prompt.delimiter = ''
  prompt.start()

  prompt.get({
    properties: {
      name: {
        description: "New Client's Name: ".green,
        required: true
      },
      interval: {
        description: 'Update parent interval in ms (1min): '.green,
        required: true,
        default: 60000
      },
      lat: {
        description: 'Aprox latitude of client: '.green,
        pattern: /^((\-)?[0-9]{1,3}.[0-9]{0,8})$/,
        required: true
      },
      lon: {
        description: 'Aprox longitude of client: '.green,
        pattern: /^((\-)?[0-9]{1,3}.[0-9]{0,8})$/,
        required: true
      },
      // port: {
      //   description: 'Communication port: '.green,
      //   pattern: /^([0-9]{1,5})$/,
      //   required: true,
      //   default: 3305
      // },
      server: {
        description: 'Home server address:port '.green,
        // pattern: /^([0-9]{1,5})$/,
        required: true,
        default: '127.0.0.1:9905'
      }
    }

  }, function (err, userInput) {
    if (err) throw err

    // Start PGP Key gen
    console.log('TheWatcher >> Server :: Setup >> Creating PGP Keys..'.cyan)

    // Start PGP Key gen
    generate_key(userInput, function (PGPKeyPath) {
      template.id = id_gen(userInput.name)
      template.name = userInput.name
      template.lat = userInput.lat
      template.lon = userInput.lon
      template.created_at = Date.now()
      // template.port = userInput.port
      template.server = userInput.server
      template.key.private.path = PGPKeyPath.Private
      template.key.public.path = PGPKeyPath.Public

      create_json(template)
    })
  })
}
