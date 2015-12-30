// #TheWatcher
// By #TheDoxMedia
//

// Called directly ( node index.js <...> )
if (require.main === module) {
  // Load cmd.js
  require('./bin/cmd')
} else {
  // Export thewatcher
  module.exports = require('./bin/app')
}
