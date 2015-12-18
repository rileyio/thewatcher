var fs = require('fs');
var path = require('path');

module.exports = function(keys) {
	var _keys = {
		private: undefined,
		public: undefined
	};

	try {
		// Check that key path is not empty
		// if (keys.private.length) {
		console.log('NightWatch >> Client >> PGP [Private] Key Loaded!'.green);
		// _keys.private = loadKey(keys.private.path);

		console.log('NightWatch >> Client >> PGP [Public] Key Loaded!'.green);
		_keys.public = loadKey(keys.public.path);

		return _keys;
		
		// }
	} catch (err) {
		console.log('NightWatch >> Error >> '.red, err);
	}
};

function loadKey(kPath) {
	return fs.readFileSync(path.join(process.env.NW_INSTALL_DIR, kPath));
}