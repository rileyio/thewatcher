exports.up = function (knex, Promise) {

	return Promise.all([
		knex.schema.createTableIfNotExists('clients', function (table) {
			table.increments('id');
			table.string('name', 64);
			table.string('session', 64);
			table.string('pubkey', 2048);
		})
	]);
	
};

exports.down = function (knex, Promise) {
	// Nothing for nows
	console.log('Down')
};