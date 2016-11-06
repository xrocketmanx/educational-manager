var express = require('express');
var router = express.Router();
var Course = require('../model/course');

router.get('/:id', function(req, res) {
    Course.dao.get(req.params.id, function(error, course) {
        res.render('course', {course: course});
    });
});

router.post('/:id/like', function(req, res) {
    Course.dao.get(req.params.id, function(error, course) {
        var likes = course.likes + 1;
        Course.dao.update({id: course.id, likes: likes});
        res.send({likes: likes});
    });
});

module.exports = router;


