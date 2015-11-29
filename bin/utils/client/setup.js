var crypto = require('crypto');
var prompt = require('prompt');
var fs = require('fs');
var openpgp = require('openpgp');
var nodeSpinner = require('node-spinner');

module.exports = function(calling) {
	var _client = {
		name: '',
		id: '',
		lat: '',
		lon: '',
		createTime: 0,
		mode: 'client',
		port: 0,
		valid: true,
		key: {
			public: {
				path: undefined,
			},
			private: {
				path: undefined,
			}
		}
	};

	// Get user input
	prompt.message = "";
	prompt.delimiter = "";
	prompt.start();

	prompt.get({
		properties: {
			name: {
				description: 'New Client\'s Name: '.green,
				required: true
			},
			interval: {
				description: 'Update parent interval in ms (1min): '.green,
				required: true,
				default: 60000
			},
			lat: {
				description: 'Aprox latitude of client: '.green,
				pattern: /^((\-)?[0-9]{1,3}.[0-9]{0,8})$/,
				required: true
			},
			lon: {
				description: 'Aprox longitude of client: '.green,
				pattern: /^((\-)?[0-9]{1,3}.[0-9]{0,8})$/,
				required: true
			},
			port: {
				description: 'Communication port: '.green,
				pattern: /^([0-9]{1,5})$/,
				required: true,
				default: 3305
			}
		},

	}, function(err, userInput) {
		// Start PGP Key gen
		generate_key(userInput, function(PGPKeyPath) {
			_client.id = id_gen(userInput.name);
			_client.name = userInput.name;
			_client.lat = userInput.lat;
			_client.lon = userInput.lon;
			_client.createTime = (Date.now() / 1000);
			_client.port = userInput.port;
			_client.key.private.path = PGPKeyPath.Private;
			_client.key.public.path = PGPKeyPath.Public;

			create_json(_client);
		});
	});
}

function create_json(data) {
	prompt.message = "";
	prompt.delimiter = "";
	prompt.start();

	// Ask user if they would like to generate a client.json
	prompt.get({
		properties: {
			name: {
				description: 'Generate a client.json file with the Name & ID [y|n] ? ',
				pattern: /^(y|n)$/,
				required: true
			}
		}
	}, function(err, results) {
		if (results.name.toLowerCase() == 'y') {
			// Answering [y]es writes the client.json file
			fs.writeFile('client.json', JSON.stringify(data, null, '\t'), function() {
				if (err) throw err;
				console.log('NightWatch >> Client :: CreateJSON >> client.json'.cyan);
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
		passphrase: 'super long and hard to guess secret'
	};

	// var s = nodeSpinner();

	// setInterval(function() {
	// 	process.stdout.write('\r \033[36 NightWatch >> Client :: Setup >> Creating PGP Keys\033[m ' + s.next());
	// }, 200);

	console.log('NightWatch >> Client :: Setup >> Creating PGP Keys'.cyan);

	openpgp.generateKeyPair(options).then(function(keypair) {
		// Success
		var privkey = keypair.privateKeyArmored;
		var pubkey = keypair.publicKeyArmored;

		// Save keys to files
		// [PRI] {install}/conf/keys/PrivateKey.pgp
		fs.writeFileSync('./conf/keys/PrivateKey', privkey);

		// [PUB] {install}/conf/keys/PublicKey.pgp
		fs.writeFileSync('./conf/keys/PublicKey.pgp', pubkey);

		// Callback
		callback({
			Private: './conf/keys/PrivateKey',
			Public: './conf/keys/PublicKey.pgp'
		});

	}).catch(function(error) {
		// Failure
		console.log(error);
	});
}
