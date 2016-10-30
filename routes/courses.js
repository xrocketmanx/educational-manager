var express = require('express');
var router = express.Router();
var Course = require('../model/course');

router.get('/', function (req, res) {
	var options = {};
	if (req.query.order) {
		options.order = {};
		options.order[req.query.order] = req.query.dir; 
	}
	Course.dao.select(function(error, courses) {
		res.render('courses', { courses: courses });
	}, options);
});

module.exports = router;