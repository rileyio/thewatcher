var openpgp = require('openpgp');

module.exports = function (key, message, callback) {
	var readKey = openpgp.key.readArmored(key);
	
	openpgp.signClearMessage(readKey.keys[0], message)
		.then(callback);
};