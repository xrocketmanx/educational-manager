var path = require('path');
var urls = require('./urls');

module.exports = function(app) {
    app.locals.urls = [];

    app.use('/', router('index'));
    app.use('/courses', router('courses'));
    app.use('/course/', router('course'));
    app.use('/contacts', router('contacts'));
    app.use('/about', router('about'));
    app.use('/editor', router('editor'));

    //urls for templates
    app.locals.urls = urls;

    function router(name) {
        return require(path.join(app.get('routes'), name));
    }
}