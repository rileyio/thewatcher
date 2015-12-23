var crypto = require('crypto');
var prompt = require('prompt');
var fs = require('fs');
var openpgp = require('openpgp');
var path = require('path');
var logger = require('winston');

var Setup = function () {
	var self = this;
	
	// Set log level
	if (process.env.NODE_ENV === 'test'){
		logger.setLevels('error');
	}

	self.conf = {
		name: '',
		// version: NW.version,
		id: '',
		lat: '',
		lon: '',
		createTime: 0,
		mode: 'server',
		port: 3306,
		key: {
			public: {
				path: undefined,
			},
			private: {
				path: undefined,
			}
		},
		db: {
			type: '',
			host: '',
			database: '',
			user: '',
			pass: ''
		}
	};
}

Setup.prototype.run = function () {
	var self = this;
	
	// Get user input
	prompt.message = "";
	prompt.delimiter = "";
	prompt.start();

	prompt.get({
		properties: {
			name: {
				description: 'New Server\'s Name: '.green,
				required: true
			},
			lat: {
				description: 'Aprox latitude of server: '.green,
				pattern: /^((\-)?[0-9]{1,3}.[0-9]{0,8})$/,
				required: true
			},
			lon: {
				description: 'Aprox longitude of server: '.green,
				pattern: /^((\-)?[0-9]{1,3}.[0-9]{0,8})$/,
				required: true
			},
			port: {
				description: 'Listen port: '.green,
				pattern: /^([0-9]{1,5})$/,
				required: true,
				default: 3306
			},
			dbType: {
				description: 'Database Type: '.yellow,
				required: true,
				default: 'mysql'
			},
			dbHost: {
				description: 'Database address/host:port: '.yellow,
				required: true,
				default: '127.0.0.1'
			},
			dbName: {
				description: 'Database name: '.yellow,
				required: true,
				default: 'nightwatch'
			},
			dbUser: {
				description: 'Database user: '.yellow,
				required: true
			},
			dbPass: {
				description: 'Database user\'s password: '.yellow,
				required: true
			}
		},

	}, function (err, userInput) {
		// Start PGP Key gen
		self.generate_key(userInput, function (PGPKeyPath) {
			self.conf.id = id_gen(userInput.name);
			self.conf.name = userInput.name;
			self.conf.lat = userInput.lat;
			self.conf.lon = userInput.lon;
			self.conf.createTime = (Date.now() / 1000);
			self.conf.port = userInput.port;
			self.conf.key.private.path = PGPKeyPath.Private;
			self.conf.key.public.path = PGPKeyPath.Public;
			
			// Database
			self.conf.db.type = userInput.dbType;
			self.conf.db.host = userInput.dbHost;
			self.conf.db.database = userInput.dbName;
			self.conf.db.user = userInput.dbUser;
			self.conf.db.pass = userInput.dbPass;

			self.create_json(self.conf);
		});
	});
}

Setup.prototype.create_json = function (data) {
	prompt.message = "";
	prompt.delimiter = "";
	prompt.start();

	// Ask user if they would like to generate a server.json
	prompt.get({
		properties: {
			name: {
				description: 'Generate a server.json file with the Name & ID [y|n] ? ',
				pattern: /^(y|n)$/,
				required: true
			}
		}
	}, function (err, results) {
		if (results.name.toLowerCase() == 'y') {
			// Answering [y]es writes the server.json file
			fs.writeFile(path.join(__NW, 'conf/server.json'), JSON.stringify(data, null, '\t'), function () {
				if (err) throw err;
				console.log('NightWatch >> Server :: CreateJSON >> server.json'.cyan);
			});
		}
	});
}

Setup.prototype.id_gen = function (name) {
	var shasum = crypto.createHash('sha512');
	var curTime = (Date.now() / 1000);

	shasum.update(name + '_' + curTime);

	return shasum.digest('hex');
}

Setup.prototype.generate_key = function (userInput, callback) {
	var options = {
		numBits: 2048,
		userId: userInput.name,
		passphrase: 'super long and hard to guess secret'
	};

	// console.log('NightWatch >> Server :: Setup >> Creating PGP Keys..'.cyan);
	logger.log('info', 'NightWatch >> Server :: Setup >> Creating PGP Keys..'.cyan);

	openpgp.generateKeyPair(options).then(function (keypair) {
		// Success
		var privkey = keypair.privateKeyArmored;
		var pubkey = keypair.publicKeyArmored;

		// Save keys to files
		// [PRI] {install}/conf/keys/SVR_PrivateKey.pgp
		fs.writeFileSync(path.join(__NW, 'conf/keys/SVR_PrivateKey'), privkey);

		// [PUB] {install}/conf/keys/SVR_PublicKey.pgp
		fs.writeFileSync(path.join(__NW, 'conf/keys/SVR_PublicKey.pgp'), pubkey);

		// Callback
		callback({
			Private: path.join(__NW, 'conf/keys/SVR_PrivateKey'),
			Public: path.join(__NW, 'conf/keys/SVR_PublicKey.pgp')
		});

	}).catch(function (error) {
		// Failure
		console.log(error);
	});
}

module.exports = Setup;