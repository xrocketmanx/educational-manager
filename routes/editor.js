var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({storage: getImagesStorage()});
var fs = require('fs');
var Course = require('../model/course');
var Lecture = require('../model/lecture');

router.get('/', function(req, res) {
    Course.dao.select(function(error, courses) {
        res.render('editor', {courses: courses});
    }, {order:{date:'desc'}});
});

router.post('/', upload.single('image'), function(req, res) {
    var course = new Course(req.body.name, req.body.description, 0, req.file.filename, Date.now());
    Course.dao.insert(course);
    res.redirect('back');
});

router.post('/edit', upload.single('image'), function(req, res) {
    var IMAGES_PATH = __dirname + '/../public/static/img/courses/';
    if (req.body.delete) {
        fs.unlinkSync(IMAGES_PATH + req.body.imagename);
        Course.dao.delete({id: req.body.id});
        Lecture.dao.delete({course_id: req.body.id});
    } else {
        var values = {id: req.body.id, name: req.body.name, description: req.body.description};
        if (req.file) {
            fs.unlinkSync(IMAGES_PATH + req.body.imagename);
            values.imageName = req.file.filename;
        }
        Course.dao.update(values);
    }
    res.redirect('back');
});

function getImagesStorage() {
    var IMAGES_PATH = __dirname + '/../public/static/img/courses/';
    var FILENAME_TEMPLATE = /(.*)(\..*)/;

    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, IMAGES_PATH);
        },
        filename: function (req, file, cb) {
            var filename = file.originalname.match(FILENAME_TEMPLATE);
            cb(null, filename[1] + '-' + Date.now() + filename[2]);
        }
    });
}

module.exports = router;
