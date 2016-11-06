// Abstract
function DAO(Model) {
    this.Model = Model;
}

DAO.prototype.db = require('../db').getInstance();

DAO.prototype.insert = function(model, callback) {
    this.db.connect();
    this.db.insert({table: this.TABLE, values: this._prepareModel(model)}, callback);
    this.db.close();
};

DAO.prototype.update = function(model) {
    this.db.connect();
    this.db.update({
        table: this.TABLE,
        values: this._prepareModel(model),
        where: {id: model.id}
    });
    this.db.close();
};

DAO.prototype.delete = function(model) {
    this.db.connect();
    this.db.delete({
        table: this.TABLE,
        where: {id: model.id}
    });
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

DAO.prototype.get = function(id, callback) {
    var self = this;
    this.db.connect();
    this.db.select({
        table: this.TABLE,
        where: {id: id}}, function(error, rows) {
        if (error) {
            callback(error);
        } else {
            callback(error, self._createModel(rows[0]));
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

DAO.prototype._prepareModel = function(model) {
    var prepared = {};
    for (var key in model) {
        if (model.hasOwnProperty(key) && key !== 'id') {
            prepared[key] = model[key];
        }
    }
    return prepared;
};

DAO.prototype._createModel = function(obj) { /*need override*/
};

module.exports = DAO; 