var express = require('express');
var router = express.Router();
var Course = require('../model/course');
var Lecture = require('../model/lecture');

var IMAGES_PATH = __dirname + '/../public/static/img/courses/';
var filesaver = require('../utils/filesaver')(IMAGES_PATH);

router.get('/', function(req, res) {
    Course.dao.select(function(error, courses) {
        res.render('editor', {courses: courses});
    }, {order:{date:'desc'}});
});

router.post('/', filesaver.upload.single('image'), function(req, res) {
    var course = new Course(req.body.name, req.body.description, 0, req.file.filename, Date.now());
    Course.dao.insert(course);
    res.redirect('back');
});

router.post('/edit', filesaver.upload.single('image'), function(req, res) {
    if (req.body.delete) {
        Course.dao.delete({id: req.body.id});
        Lecture.dao.delete({course_id: req.body.id});
        filesaver.remove(req.body.imagename);
    } else {
        var values = {id: req.body.id, name: req.body.name, description: req.body.description};
        if (req.file) {
            filesaver.remove(req.body.imagename);
            values.imageName = req.file.filename;
        }
        Course.dao.update(values);
    }
    res.redirect('back');
});

module.exports = router;
