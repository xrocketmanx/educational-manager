var express = require('express');
var path = require('path');
var app = express();

var morgan = require('morgan');
app.use(morgan('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/templates'));

app.set('routes', path.join(__dirname, 'routes'));

var urls = require('./urls');
urls(app);
 
app.use('/', express.static('public/static'));

module.exports = app;