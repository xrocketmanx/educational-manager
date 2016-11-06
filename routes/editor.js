var express = require('express');
var router = express.Router();
var Course = require('../model/course');

router.get('/', function(req, res) {
    Course.dao.select(function(error, courses) {
        res.render('editor', {courses: courses});
    }, {});
});

module.exports = router;
