var DAO = require('./dao');

function LectureDAO() {
    DAO.apply(this, arguments);
}

LectureDAO.prototype = Object.create(DAO.prototype);
LectureDAO.prototype.constructor = LectureDAO;

LectureDAO.prototype.TABLE = 'lecture';

LectureDAO.prototype._createModel = function(obj) {
    return new this.Model(obj.description, obj.video_url, obj.attached_file, obj.course_id, obj.id);
};

module.exports = LectureDAO;