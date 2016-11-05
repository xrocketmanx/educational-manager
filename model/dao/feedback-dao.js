var DAO = require('./dao');

function FeedbackDAO() {
    DAO.apply(this, arguments);
}

FeedbackDAO.prototype = Object.create(DAO.prototype);
FeedbackDAO.prototype.constructor = FeedbackDAO;

FeedbackDAO.prototype.TABLE = 'feedback';

FeedbackDAO.prototype._createModel = function(obj) {
    return new this.Model(obj.text, obj.date, obj.id);
};

module.exports = FeedbackDAO;