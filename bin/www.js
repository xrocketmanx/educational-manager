var app = require('../app.js');

var PORT = process.env['PORT'] || 3000;

app.listen(PORT, function () {
	console.log('listening on ' + PORT);
});