var CourseDAO = require('./dao/course-dao');

function Course(name, description, likes, imageName) {
	this.name = name;
	this.description = description;
	this.likes = likes;
	this.imageName = imageName;
}

Course.dao = new CourseDAO(Course);

module.exports = Course;