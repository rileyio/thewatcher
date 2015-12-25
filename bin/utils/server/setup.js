var crypto = require('crypto');
var prompt = require('prompt');
var fs = require('fs');
var openpgp = require('openpgp');
var path = require('path');

module.exports = function (calling) {
	var _server = {
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
				default: 'thewatcher'
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
		generate_key(userInput, function (PGPKeyPath) {
			_server.id = id_gen(userInput.name);
			_server.name = userInput.name;
			_server.lat = userInput.lat;
			_server.lon = userInput.lon;
			_server.createTime = (Date.now() / 1000);
			_server.port = userInput.port;
			_server.key.private.path = PGPKeyPath.Private;
			_server.key.public.path = PGPKeyPath.Public;
			
			// Database
			_server.db.type = userInput.dbType;
			_server.db.host = userInput.dbHost;
			_server.db.database = userInput.dbName;
			_server.db.user = userInput.dbUser;
			_server.db.pass = userInput.dbPass;

			create_json(_server);
		});
	});
}

function create_json(data) {
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
				console.log('TheWatcher >> Server :: CreateJSON >> server.json'.cyan);
			});
		}
	});
}

function id_gen(name) {
	var shasum = crypto.createHash('sha512');
	var curTime = (Date.now() / 1000);

	shasum.update(name + '_' + curTime);

	return shasum.digest('hex');
}

function generate_key(userInput, callback) {
	var options = {
		numBits: 2048,
		userId: userInput.name,
		// passphrase: 'super long and hard to guess secret'
	};

	console.log('TheWatcher >> Server :: Setup >> Creating PGP Keys..'.cyan);

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
