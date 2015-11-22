module.exports = function(){
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
};