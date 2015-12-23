// #NightWatch
// By #TheDoxMedia
//

var NightWatch = require('./bin/app');
var app = new NightWatch;

// Parse args
app.init(process.argv);
app.start({ mode: 'server' });  // Can be used to override/inplace app.init
// app.start();