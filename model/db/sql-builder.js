var COMMAND_TEMPLATES = {
	INSERT: "INSERT INTO $table ($keys) VALUES ($values)",
	SELECT: "SELECT * FROM $table $where $order",
	UPDATE: "UPDATE $table $set $where",
	DELETE: "DELETE FROM $table $where",
	PARTS: {
		where: {
			begin: " WHERE ",
			template: "$field $sign '$value'",
			delimiter: " AND ",
			compose: function(key, value) {
				return {
					field: key,
					sign: value.sign,
					value: value.value
				};
			}
		},
		order: {
			begin: " ORDER BY ",
			template: "$field $direction",
			delimiter: ",",
			compose: function(key, value) {
				return {
					field: key,
					direction: value
				};
			}
		},
		set: {
			begin: " SET ",
			template: "$field = '$value'",
			delimiter: ",",
			compose: function(key, value) {
				return {
					field: key,
					value: value
				};
			}
		},
		values: {
			begin: "",
			template: "'$field'",
			delimiter: ",",
			compose: function(key, value) {
				return {
					field: value
				};
			}
		},
		keys: {
			begin: "",
			template: "$field",
			delimiter: ",",
			compose: function(key, value) {
				return {
					field: key
				};
			}
		}
	}
};

function buildPart(part, values) {
	if (!values) {
		return '';
	}
	var statements = [];
	for (var key in values) {
		var statement = formatStatement(part.template, part.compose(key, values[key]))
		statements.push(statement);
	}
	return part.begin + statements.join(part.delimiter);
}

function formatStatement(command, args) {
	for (var key in args) {
		command = command.replace('$' + key, args[key]);
	}
	return command;
}

module.exports.build = function(command, options) {
	var statement = COMMAND_TEMPLATES[command];
	var parts = statement.match(/\$([a-zA-Z]+)/g).map(function(part) {
		return part.slice(1);
	});

	var args = parts.reduce(function(obj, part) {
		var template = COMMAND_TEMPLATES.PARTS[part];
		if (template) {
			var values = options[part];
			obj[part] = buildPart(template, values);
		} else {
			obj[part] = options[part];
		}
		return obj;
	}, {});

	return formatStatement(statement, args);
};