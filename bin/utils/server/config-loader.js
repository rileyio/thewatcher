var fs = require('fs');
var path = require('path');

module.exports = function(){
	// Config path
	var configPath = path.resolve(process.env.NW_DIR, 'conf/server.json');

	// Try loading the default config location
	// Wrapped in try to throw config loading error if files does not exist.
	try {
		var config = fs.readFileSync(configPath);
		
		// Run through JSON.parse
		var configParsed = JSON.parse(config);
		
		// TODO
		// Validate Server config before returing for required values
		
	} catch (error) {
		if (error.code === 'ENOENT'){
			console.log('Server config missing ( conf/server.json )'.red);
			process.exit(0);
		}
		else{
			console.log(error.red);
		}
	}

	// Return parsed config
	return configParsed;
};