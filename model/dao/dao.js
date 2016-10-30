// Abstract
function DAO(Model) { 
	this.Model = Model;
}

DAO.prototype.db = require('../db').getInstance();

DAO.prototype.insert = function(object) {
	this.db.connect();
	this.db.insert(this.TABLE, object);
	this.db.close();
};

DAO.prototype.select = function(callback, options) {
	var self = this;
	this.db.connect();
	this.db.select(this.TABLE, function(error, rows) {
		if (error) {
			callback(error);
		} else {
			callback(error, rows.map(self._createModel.bind(self)));
		}
	}, options);
	this.db.close();
};

DAO.prototype._createModel = function(obj) { /*need override*/ };

module.exports = DAO; 