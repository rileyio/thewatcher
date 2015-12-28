var fs = require('fs');
var keyReader = require('./key-reader');
var path = require('path');

module.exports = function(type){
	// Config path
	var configPath = path.join(__TW, 'conf/', type + '.json');

	// Try loading the default config location
	// Wrapped in try to throw config loading error if files does not exist.
	try {
		var config = fs.readFileSync(configPath);
		
		// Run through JSON.parse
		var configParsed = JSON.parse(config.toString());
		
		// Load PGP keys
		// config.key = array of key paths
		configParsed.key = keyReader(configParsed.key, type);
		
	} catch (error) {
		if (error.code === 'ENOENT'){
			console.log('Config missing ( conf/%s.json )'.red, type);
			process.exit(0);
		}
		else{
			console.log(error.red);
		}
	}

	// Return parsed config
	return configParsed;
};