var openpgp = require('openpgp');

module.exports = function(req, config, callback) {
	var key = '-----BEGIN PGP PRIVATE KEY BLOCK ... END PGP PRIVATE KEY BLOCK-----';
	var privateKey = openpgp.key.readArmored(key).keys[0];


	// If the request is not blank
	if (req) {
		var ServerName = req.server.name;
		// var ServerID =

	}
};


// privateKey.decrypt('passphrase');
// var pgpMessage = '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----';
// pgpMessage = openpgp.message.readArmored(pgpMessage);

// openpgp.decryptMessage(privateKey, pgpMessage).then(function(plaintext) {
// 	// success
// }).catch(function(error) {
// 	// failure
// });
