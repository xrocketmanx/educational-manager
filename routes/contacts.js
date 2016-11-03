var express = require('express');
var router = express.Router();
var Feedback = require('../model/feedback');

router.get('/', function (req, res) {
	res.render('contacts');
});

router.post('/feedback', function (req, res) {
	var feedback = new Feedback(req.body.text, +(new Date()));
	Feedback.dao.insert(feedback);
	res.redirect('back');
});

module.exports = router;