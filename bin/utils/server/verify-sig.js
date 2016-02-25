var openpgp = require('openpgp')

/**
 * Verify PGP signature.
 * @param {string} signedMsg - Raw to string PGP Key.
 * @param {string} signedMsg - Message to be validated.
 * @callback {Object}
 */
module.exports = function (key, signedMsg, callback) {
  var readKey = openpgp.key.readArmored(key)
  var message = openpgp.cleartext.readArmored(signedMsg)

  openpgp.verifyClearSignedMessage(readKey.keys[0], message)
    .then(callback)
}
