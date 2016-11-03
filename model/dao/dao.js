// Abstract
function DAO(Model) { 
	this.Model = Model;
}

DAO.prototype.db = require('../db').getInstance();

DAO.prototype.insert = function(object, callback) {
	this.db.connect();
	this.db.insert({ table: this.TABLE, values: object }, callback);
	this.db.close();
};

DAO.prototype.select = function(callback, options) {
	options = options || {};
	options.table = this.TABLE;
	
	var self = this;
	this.db.connect();
	this.db.select(options, function(error, rows) {
		if (error) {
			callback(error);
		} else {
			callback(error, rows.map(self._createModel.bind(self)));
		}
	});
	this.db.close();
};

DAO.prototype.count = function(callback) {
	this.db.connect();
	this.db.count(this.TABLE, function(error, row) {
		if (error) {
			callback(error);
		} else {
			callback(error, row.count);
		}
	});
	this.db.close();
};

DAO.prototype._createModel = function(obj) { /*need override*/ };

module.exports = DAO; 