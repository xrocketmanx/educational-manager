var express = require('express');
var router = express.Router();
var Lecture = require('../model/lecture');

var FILES_PATH = __dirname + '/../public/static/files/';
var filesaver = require('../utils/filesaver')(FILES_PATH);

router.get('/:id', function(req, res) {
    Lecture.dao.select(function(error, lectures) {
        res.render('course-editor', {lectures: lectures});
    }, {where: {course_id: req.params.id}});
});

router.post('/:id', filesaver.upload.single('attachedFile'), function(req, res) {
    var filename = req.file ? req.file.filename : '';
    var lecture = new Lecture(req.body.description, req.body.videoUrl, filename, req.params.id);
    Lecture.dao.insert(lecture);
    res.redirect('back');
});

router.post('/:id/edit', filesaver.upload.single('attachedFile'), function(req, res) {
    if (req.body.delete) {
        Lecture.dao.delete({id: req.body.id});
        filesaver.remove(req.body.attachedFile);
    } else if (req.body.deletefile) {
        filesaver.remove(req.body.filename);
        Lecture.dao.update({id: req.body.id, attachedFile: ''});
    } else {
        var values = {id: req.body.id, videoUrl: req.body.videoUrl, description: req.body.description};
        if (req.file) {
            filesaver.remove(req.body.filename);
            values.attachedFile = req.file.filename;
        }
        Lecture.dao.update(values);
    }
    res.redirect('back');
});

module.exports = router;
