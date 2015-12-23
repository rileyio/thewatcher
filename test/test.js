var assert = require('assert');
var should = require('should');
var NightWatch = require('../bin/app');
var Utils = require('../bin/utils/utils');
var path = require('path');

describe('Test NightWatch', function () {
	process.env.NODE_ENV = 'test';

	beforeEach(function () {
		global.__NW = path.resolve(__dirname + '/..');
	});
	
	it('start server mode', function(){
		Utils.mode('server');			
	})
	// NightWatch.init();
	// });
});