var fs = require('fs');
var path = require('path');

module.exports = function(callback){
	// Config path
	var configPath = path.resolve(process.env.NW_DIR, 'conf/secrver.json');

	// Try loading the default config location
	// Wrapped in try to throw config loading error if files does not exist.
	try {
		var config = fs.readFileSync(configPath);
	} catch (error) {
		if (error.code === 'ENOENT'){
			console.log('Server config missing ( conf/server.json )'.red);
			process.exit(0);
		}
	}
	
	// return callback(err, config);
};