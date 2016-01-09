// #TheWatcher
// By #TheDoxMedia
//
// Main js file for loading the project.
// Running: node index.js -c <path to config file>

var Utils = require('./utils/utils')
var Manage = require('./utils/toolbox/manage')
var Server = require('./server/server')
var Client = require('./client/client')


var TheWatcher = module.exports

/*
  Prototypes/Extends
*/
TheWatcher.manage = Manage
TheWatcher.utils = Utils

/*
  Constructors (var .. = new Mode)
*/
TheWatcher.Server = Server
TheWatcher.Client = Client
