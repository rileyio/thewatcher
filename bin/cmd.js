#!/usr/bin/env node
// #TheWatcher
// By #TheDoxMedia
//

var TheWatcher = require('./app')
var minimist = require('minimist')
var packageJson = require('../package.json')
var path = require('path')
// var child_process = require('child_process')

process.title = 'TheWatcher'

// process.on('exit', function () {
//   console.log('TheWatcher exiting..'.cyan)
// })

// thewatcher -m <server|client>

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
    'db',
    'add',
    'export',
    'mode',
    'setup'
  ]
})

// Setup a client or server & setup its {type}.json
if (args.setup) {
  TheWatcher.utils[args.setup].setup()
} else if (args.mode) { // Start TheWatcher in requested mode

  switch (args.mode) {
    case 'server':
      var server = new TheWatcher.Server()
      server.start()
      // setTimeout(function () {
      //   server.close()
      // }, 6000)

      break
    case 'client':
      var client = new TheWatcher.Client()
      client.start()
      break
    default:
      console.log('Valid modes are: server and client'.red)
      break
  }
} else if (args.add) {
  TheWatcher.manage.add.client(args.add)
} else if (args.export) {
  TheWatcher.manage.export.client(args)
} else if (args.db) {
  extendedUtils(args.db)
} else {
  console.log(args)

  // If no selection is made, return fullText()
  fullText()
}

function extendedUtils (dbArg) {
  switch (dbArg) {
    case 'setup':
      TheWatcher.manage.setupDB()
      break

    default:
      console.log('Check available options for --db')
      break
  }
}

function fullText () {
  console.log(`
   TheWatcher - ${packageJson.version}

   ===============================================

   Usage: thewatcher [switch] <opt>

   [switch] <opt>:
      -a, --add     <path_to_save>
      -m, --mode    <server|client>
      -s, --setup   <server|client>
      --export      <client> <path_to_save>
      --db          <setup>

   Examples:
      thewatcher -m server  Start in server mode
      thewatcher -s client  Interactive setup
      thewatcher -a         /path/to/client.json

`)
}
