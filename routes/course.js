var express = require('express');
var router = express.Router();
var Course = require('../model/course');
var Lecture = require('../model/lecture');

router.get('/:id', function(req, res) {
    Course.dao.get(req.params.id, function(error, course) {
        Lecture.dao.select(function(error, lectures) {
            res.render('course', {course: course, lectures: lectures});
        }, {where: {course_id: req.params.id}});
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


