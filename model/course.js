var CourseDAO = require('./dao/course-dao');

function Course(name, description, likes, imageName, date, id) {
    this.name = name;
    this.description = description;
    this.likes = likes;
    this.imageName = imageName;
    this.date = date;
    this.id = id;
}

Course.dao = new CourseDAO(Course);

module.exports = Course;