var fs = require('fs');
var keyReader = require('./key-reader');
var path = require('path');

module.exports = function(type){
	var configPath = undefined;
	var optPath = (arguments[1] !== undefined ? arguments[1][0] : undefined);
	
	// Default config location and name based off type
	var defaultPath = path.join(__TW, 'conf/', type + '.json');
	
	// Optional override of configPath if arguments[1] is set.
	// Set config path
	configPath = (optPath === undefined ? defaultPath : optPath);
	console.log('configPath',configPath)
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
			console.log('err', error.red);
		}
	}

	// Return parsed config
	return configParsed;
};