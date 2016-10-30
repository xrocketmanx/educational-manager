var sqlite3 = require('sqlite3').verbose();
var config = require('./config');

var COMMANDS = {
	INSERT: "INSERT INTO $table ($keys) VALUES ($values)",
	SELECT: "SELECT * FROM $table",
	WHERE: "$field $sign $value",
	ORDER: "$field $direction",
	UPDATE: "UPDATE $table SET $fields",
	DELETE: "DELETE FROM $table"
};

function formatCommand(command, options) {
	for (var key in options) {
		command = command.replace(key, options[key]);
	}
	return command;
}

var syntaxGenerator = {
	filter: function(options) {
		var parts = [];
		for (var field in options) {
			parts.push(formatCommand(COMMANDS.WHERE, {
				$field: field,
				$sign: options[field].sign,
				$value: options[field].value
			}));
		}
		return ' WHERE ' + parts.join(' AND ');
	},
	order: function(options) {
		var parts = [];
		for (var field in options) {
			parts.push(formatCommand(COMMANDS.ORDER, {
				$field: field,
				$direction: options[field]
			}));
		}
		return ' ORDER BY ' + parts.join(',');
	}
};

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

DBController.prototype.insert = function(table, options) {
	var values = Object.keys(options).map(function(key) { return "'" + options[key] + "'"; }).join(',');
	var keys = Object.keys(options).join(',');

	var command = formatCommand(COMMANDS.INSERT, {
		$table: table,
		$keys: keys,
		$values: values
	});
	this.db.run(command);
};

DBController.prototype.update = function(table, options, filterOptions) {
	var fields = Object.keys(options).map(function(key) { return key + '=' + "'" + options[key] + "'"; }).join(',');
	var command = formatCommand(COMMANDS.UPDATE, {
		$table: table,
		$fields: fields
	});
	for (var key in filterOptions) {
		command += syntaxGenerator[key](options[key]);
	}
	this.db.run(command);
};

DBController.prototype.delete = function(table, options) {
	var command = formatCommand(COMMANDS.DELETE, {
		$table: table
	});
	for (var key in options) {
		command += syntaxGenerator[key](options[key]);
	}
	this.db.run(command);
};

DBController.prototype.select = function(table, callback, options) {
	var command = formatCommand(COMMANDS.SELECT, {
		$table: table
	});
	for (var key in options) {
		command += syntaxGenerator[key](options[key]);
	}
	this.db.all(command, callback);
};

var dbController = null;
module.exports.getInstance = function() {
	if (!dbController) {
		dbController = new DBController(config);
	}	
	return dbController;
};