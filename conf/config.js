module.exports = {
	name: 'NightWatch',
	version: '0.0.2',
	port: 3306,
	args: require('./args'),

	db: {
		type: 'mysql',
		host: '',
		database: '',
		user: '',
		pass: ''
	}
};