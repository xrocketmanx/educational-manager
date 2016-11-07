var LectureDAO = require('./dao/feedback-dao');

function Lecture(description, videoUrl, courseId, id) {
    this.id = id;
    this.description = description;
    this.videoUrl = videoUrl;
    this.courseId = courseId;
}

Lecture.dao = new LectureDAO(Lecture);

module.exports = Lecture;