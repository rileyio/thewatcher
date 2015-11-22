// #NightWatch
// By #TheDoxMedia
//

var crypto = require('crypto');
var prompt = require('prompt');
var fs = require('fs');

exports.add = function(calling) {
	var options = {
		client: function() {
			var Datastore = require('nedb'),
				db = {
					clients: new Datastore({
						filename: './DB_NightWatch_Server__Clients.db',
						autoload: true
					})
				};

			var _client = {
				name: '',
				id: '',
				lat: '',
				lon: '',
				createTime: 0,
				mode: 'client',
				valid: true
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
						required: false,
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
					}
				},

			}, function(err, results) {
				_client.name = results.name;
				_client.id = id_gen(results.name);
				_client.lat = results.lat;
				_client.lon = results.lon;
				_client.createTime = (Date.now() / 1000);

				db.clients.insert(_client, function(err, newDoc) {
					console.log('NightWatch>>Add Client>>Success');
					console.log(' :: Client [' + 'NAME'.green + '] >> ' + newDoc.name);
					console.log(' :: Client [' + 'INTERVAL'.green + '] >> ' + results.interval);
					console.log(' :: Client [' + 'ID'.green + '] >> ' + newDoc.id);
					console.log(' :: Client [' + 'COORDS'.green + '] >> lat: ' + newDoc.lat + ' lon: ' + newDoc.lon);
					console.log(' :: Client [' + 'VALID'.green + '] >> ' + newDoc.valid);

					_client.interval = results.interval;
					create_json(_client);
				});
			});
		}
	}

	options[calling]();
}

// Function subset for validating
exports.validate = {
	client: {
		config: (function(data, callback){
			// If data.home is missing
			if (!('home' in data)) {
				console.log('Checking for home and port'.grey);
				console.log('It appears there is no home and or port set in the client config..'.red)

				// Add to file
				// Get user input
				prompt.message = "";
				prompt.delimiter = "";
				prompt.start();

				prompt.get({
					properties: {
						home: {
							description: 'Url -or- IP to NightWatch Server: '.green,
							required: true
						},
						port: {
							description: 'Port of the NightWatch Server: '.green,
							required: true
						}
					},
				}, function(err, results) {
					data.home = results.home;
					data.port = results.port;

					// Write to <client>.json
					fs.writeFile('client.json', JSON.stringify(data, null, '\t'), function() {
						if (err) throw err;
						console.log('NightWatch>>Client :: Updating Config >> client.json'.cyan);

						callback(data);
					});
				});
			}
			else{
				callback(data);
			}
		})
	}
}


function id_gen(name) {
	var shasum = crypto.createHash('sha512');
	var curTime = (Date.now() / 1000);

	shasum.update(name + '_' + curTime);

	return shasum.digest('hex');
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
				console.log('NightWatch>>Add>>Client :: CreateJSON >> client.json'.cyan);
			});
		}
	});
}
