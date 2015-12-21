var Client = function (DB) {
	var self = this;
	self.DB = DB;
};

Client.prototype.get = function (data, callback) {
	var self = this;

	console.log('NightWatch >> Server >> DB::Client(lookup:%s)'.yellow, data.name);

	self.DB('clients')
		.select('*')
		.where('name', data.name)
		.then(function (ret) {
			if (ret.length > 0) {
				console.log('NightWatch >> Server >> DB::Client(lookup:%s)->Success'.green, data.name);
				
				// Return lookup data
				return callback(ret[0]);
			}
			else {
				console.log('NightWatch >> Server >> DB::Client(lookup:%s)->Failed'.red, data.name);
				
				// Return lookup data
				return callback(null);
			}
		});
};

Client.prototype.update = function (data) {
	var self = this;

	console.log('NightWatch >> Server >> DB::Client(update:%s)'.yellow, data.name);

	self.DB('clients')
		.where('name', data.name)
		.update({
			session: data.session
		})
		.then(function (ret) {
			if (ret) {
				console.log('NightWatch >> Server >> DB::Client(update:%s)->Success'.green, data.name);
			}
			else {
				console.log('NightWatch >> Server >> DB::Client(update:%s)->Failed'.red, data.name);
			}
			
			// Return lookup data (No callback)
			return ret;
		});
};

module.exports = Client;