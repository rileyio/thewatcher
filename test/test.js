var assert = require('assert');
var should = require('should');
var TheWatcher = require('../bin/app');
var Utils = require('../bin/utils/utils');
var path = require('path');

describe('Test TheWatcher', function () {
	process.env.NODE_ENV = 'test';

	beforeEach(function () {
		global.__NW = path.resolve(__dirname + '/..');
	});
	
	it('start server mode', function(){
		Utils.mode('server');			
	})
	// TheWatcher.init();
	// });
});