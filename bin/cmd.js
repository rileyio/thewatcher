#!/usr/bin/env node
// #TheWatcher
// By #TheDoxMedia
//

var TheWatcher = require('./app');
var minimist = require('minimist');
var multiline = require('multiline');
var packageJson = require('../package.json');
// var child_process = require('child_process');

process.title = 'TheWatcher';
process.on('exit', function () {
	console.log('TheWatcher exiting..'.cyan);
});

var app = new TheWatcher;
var TW_MODE = undefined;
// var NW_CONF_PATH = undefined;

// Parse args
// Args options for startup/mode
// IF called via {thewatcher} -{s} -{arg}
var args = minimist(process.argv.slice(2), {
	alias: {
		a: 'add',
		m: 'mode',
		s: 'setup'
	},
	string: [
		'add',
		'mode',
		'setup'
	]
});

// Setup a client or server & setup its {type}.json
if (args.setup) {
	app.utils[args.setup].setup();
}
// Start TheWatcher in requested mode
else if (args.mode) {
	TW_MODE = args.mode;

	app[TW_MODE]();
}
else if (args.add){
	app.manage.addClient(args);
}
else{
	// If no selection is made, return fullText()
	fullText();
}

function fullText() {
	console.log(multiline(function () {/*
   
   TheWatcher - %s
   
   ===============================================
   
   Usage: thewatcher [switch] <opt>
   
   [switch] <opt>: 
      -a, --add			<client> <path_to_config>
      -m, --mode		<server|client>
      -s, --setup		<server|client>
	  
   Examples:
      thewatcher -m server	Start in server mode
      thewatcher -s client	Interactive setup
      thewatcher -a /path/to/client.json
   
*/}), packageJson.version);
}