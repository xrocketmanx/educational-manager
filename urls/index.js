var path = require('path');
var urls = require('./urls');

module.exports = function(app) {
	app.locals.urls = [];

	app.use('/', router('index'));
	app.use('/courses', router('courses'));
	app.use('/contacts', router('contacts'));
	app.use('/about', router('about'));

	//urls for templates
	app.locals.urls = urls;

	function router(name) {
		return require(path.join(app.get('routes'), name));
	}
}