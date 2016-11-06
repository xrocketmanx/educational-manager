var express = require('express');
var router = express.Router();
var Course = require('../model/course');

router.get('/:id', function(req, res) {
    Course.dao.get(req.params.id, function(error, course) {
        res.render('course', {course: course});
    });
});

module.exports = router;


