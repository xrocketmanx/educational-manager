var DAO = require('./dao');

function CourseDAO() {
    DAO.apply(this, arguments);
}

CourseDAO.prototype = Object.create(DAO.prototype);
CourseDAO.prototype.constructor = CourseDAO;

CourseDAO.prototype.TABLE = 'course';

CourseDAO.prototype._createModel = function(obj) {
    return new this.Model(obj.name, obj.description, obj.likes, obj.image_name, new Date(obj.date));
};

module.exports = CourseDAO;