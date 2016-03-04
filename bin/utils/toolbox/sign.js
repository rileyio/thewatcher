var openpgp = require('openpgp')

module.exports = function (key, message, callback) {
  var readKey = openpgp.key.readArmored(key)

  openpgp.sign({
    data: message.toString(),
    privateKeys: readKey.keys[0]
  })
    .then(callback)
}
