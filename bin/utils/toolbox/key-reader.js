var fs = require('fs');
var path = require('path');

module.exports = function(keys, type) {

	var keyData = {
		private: undefined,
		public: undefined
	};

	try {
		// Check that key path is not empty
		// if (keys.private.length) {
		console.log('TheWatcher >> %s >> PGP [Private] Key Loaded!'.green, type);
		keyData.private = loadKey(keys.private.path);

		console.log('TheWatcher >> %s >> PGP [Public] Key Loaded!'.green, type);
		keyData.public = loadKey(keys.public.path);
		
		// console.log(keyData)
		
		return keyData;
		
		// }
	} catch (err) {
		console.log('TheWatcher >> Error >> '.red, err);
	}
};

function loadKey(kPath) {
	return fs.readFileSync(kPath).toString();
}