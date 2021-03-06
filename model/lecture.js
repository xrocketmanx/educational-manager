var LectureDAO = require('./dao/lecture-dao');

function Lecture(description, videoUrl, attachedFile, courseId, id) {
    this.id = id;
    this.description = description;
    this.videoUrl = videoUrl;
    this.courseId = courseId;
    this.attachedFile = attachedFile;
}

Lecture.dao = new LectureDAO(Lecture);

module.exports = Lecture;