var sqlite3 = require('sqlite3').verbose();
var config = require('./config');
var sqlBuilder = require('./sql-builder');

function DBController(config) {
	this.db = null;
	this.config = config;
}

DBController.prototype.connect = function() {
	this.db = new sqlite3.Database(this.config.fileName);
};

DBController.prototype.close = function() {
	this.db.close();
};

DBController.prototype.insert = function(options) {
	var command = sqlBuilder.build('INSERT', options);
	this.db.run(command);
};

DBController.prototype.update = function(options) {
	var command = sqlBuilder.build('UPDATE', options);
	this.db.run(command);
};

DBController.prototype.delete = function(options) {
	var command = sqlBuilder.build('DELETE', options);
	this.db.run(command);
};

DBController.prototype.select = function(options, callback) {
	var command = sqlBuilder.build('SELECT', options);
	this.db.all(command, callback);
};

var dbController = null;
module.exports.getInstance = function() {
	if (!dbController) {
		dbController = new DBController(config);
	}	
	return dbController;
};