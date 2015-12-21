var openpgp = require('openpgp');

module.exports = function(key, signedMsg, callback){
	var readKey = openpgp.key.readArmored(key);
	var message = openpgp.cleartext.readArmored(signedMsg);
	
	openpgp.verifyClearSignedMessage(readKey.keys[0], message)
		.then(callback);
};