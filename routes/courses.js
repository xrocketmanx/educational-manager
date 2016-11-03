var express = require('express');
var router = express.Router();
var Course = require('../model/course');

router.get('/', function (req, res) {
	var sortOptions = new SortOptions(req.query['order'], req.query['dir'], req.query['sort-date']);
	var options = sortOptions.fillOptions({});

	Course.dao.select(function(error, courses) {
		res.render('courses', { courses: courses, 
			sortOptions: sortOptions, 
			sortFields: sortOptions.sortFields,
			dateOrders: sortOptions.dateOrders 
		});
	}, options);
});

module.exports = router;

function SortOptions(field, order, dateOrder) {
	this.sortFields = [{name: 'Рейтингом', field: 'likes'}, {name: 'Іменем', field: 'name'}];
	this.dateOrders = [{name: 'Нові', value: 'desc'}, {name: 'Старі', value: 'asc'}];
	this.field = field || this.sortFields[0].field;
	this.order = order || 'desc';
	this.dateOrder = dateOrder || this.dateOrders[0].value; 

	this.fillOptions = function(options) {
		options.order = {};
		options.order[this.field] = this.order;
		options.order['date'] = this.dateOrder;
		return options;
	};
}