// #TheWatcher
// By #TheDoxMedia
//

// Called directly ( node index.js <...> )
if (require.main === module){
	// Load cmd.js
	require('./bin/cmd')
}

// require('nightwatch')
else{
	// Export nightwatch
	module.exports = require('./bin/app')
}