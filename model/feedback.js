var FeedbackDAO = require('./dao/feedback-dao');

function Feedback(text, date, id) {
    this.text = text;
    this.date = date;
    this.id = id;
}

Feedback.dao = new FeedbackDAO(Feedback);

module.exports = Feedback;