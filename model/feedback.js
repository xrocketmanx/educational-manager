var FeedbackDAO = require('./dao/feedback-dao');

function Feedback(text, date) {
    this.text = text;
    this.date = date;
}

Feedback.dao = new FeedbackDAO(Feedback);

module.exports = Feedback;