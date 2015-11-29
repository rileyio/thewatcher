var fs = require('fs');

module.exports = function(keyPath) {
	try {
		var key = fs.readFileSync(keyPath);

		if (key.length) {
			console.log('NightWatch >> Client >> PGP Key Loaded!'.green);

			return key;
		}
	} catch (err) {
		console.log('NightWatch::Error >> '.red, err);
	}
};
