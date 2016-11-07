var express = require('express');
var router = express.Router();
var Lecture = require('../model/lecture');

router.get('/:id', function(req, res) {
    Lecture.dao.select(function(error, lectures) {
        res.render('course-editor', {lectures: lectures});
    }, {where: {course_id: req.params.id}});
});

router.post('/:id', function(req, res) {
    var lecture = new Lecture(req.body.description, req.body.videoUrl, req.params.id);
    Lecture.dao.insert(lecture);
    res.redirect('back');
});

router.post('/:id/edit', function(req, res) {
    if (req.body.delete) {
        Lecture.dao.delete({id: req.body.id});
    } else {
        var values = {videoUrl: req.body.videoUrl, description: req.body.description};
        Lecture.dao.update(values);
    }
    res.redirect('back');
});

module.exports = router;
