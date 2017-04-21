var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res) {
    res.render('course-translation', {courseId: req.params.id});
});

module.exports = router;
