#!/usr/bin/env node
// #NightWatch
// By #TheDoxMedia
//

var NightWatch = require('./app');
var minimist = require('minimist');
var multiline = require('multiline');
var packageJson = require('../package.json');
// var child_process = require('child_process');

process.title = 'NightWatch';
process.on('exit', function(){
	console.log('NightWatch exiting..'.cyan);
});

var app = new NightWatch;
var NW_MODE = undefined;
// var NW_CONF_PATH = undefined;

// Parse args
// Args options for startup/mode
// IF called via {nightwatch} -{s} -{arg}
var args = minimist(process.argv.slice(2), {
	alias: {
		m: 'mode',
		s: 'setup'
	},
	string: [
		'mode',
		'setup'
	]
});


// Setup a client or server & setup its {type}.json
if (args.setup){
	app.utils[args.setup].setup();
	process.exit(0);
}

// If a mode is start NightWatch as that
if (args.mode){
	NW_MODE = args.mode;
	
	app[NW_MODE]();
}

console.log(multiline(function(){/*
   
   NightWatch - %s
   
   ===============================================
   
   Usage: nightwatch [switch] <opt>
   
   [switch] <opt>: 
      -m, --mode		<server|client>
      -s, --setup		<server|client>
	  
   Examples:
      nightwatch -m server	Start in server mode
      nightwatch -s client	Interactive setup
   
*/}), packageJson.version);