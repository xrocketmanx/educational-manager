var sqlite3 = require('sqlite3').verbose();
var config = require('./config');
var SqlBuilder = require('./sql-builder');

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

DBController.prototype.insert = function(options, callback) {
	var sqlBuilder = new SqlBuilder();
	var statement = sqlBuilder
		.insert(options.table)
		.values(options.values);
	this.db.run(statement.toString(), function(error) {
		if (callback) callback(error, this.lastID);
	});
};

DBController.prototype.update = function(options) {
	var sqlBuilder = new SqlBuilder();
	var statement = sqlBuilder
		.update(options.table)
		.set(options.values)
		.where(options.where);
	this.db.run(statement.toString());
};

DBController.prototype.delete = function(options) {
	var sqlBuilder = new SqlBuilder();
	var statement = sqlBuilder
		.delete(options.table)
		.where(options.where);
	this.db.run(statement.toString());
};

DBController.prototype.select = function(options, callback) {
	var sqlBuilder = new SqlBuilder();
	var statement = sqlBuilder
		.select(options.table)
		.where(options.where)
		.order(options.order);
	this.db.all(statement.toString(), callback);
};

var dbController = null;
module.exports.getInstance = function() {
	if (!dbController) {
		dbController = new DBController(config);
	}	
	return dbController;
};