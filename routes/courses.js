var express = require('express');
var router = express.Router();
var Paginator = require('../utils/paginator');
var Course = require('../model/course');

router.get('/', function(req, res) {
    var sortOptions = new SortOptions(req.query['order'], req.query['sort-dir'], req.query['sort-date']);
    var options = {order: sortOptions.getOptions()};

    Course.dao.count(function(error, count) {
        var page = +req.query['page'] || 1;
        var paginator = new Paginator(count, 6);
        var paginationTemplate = paginator.render(page, { path: req.baseUrl, query: req.query});

        options.limit = {
            num: paginator.itemsPerPage,
            offset: paginator.getPageOffset(page)
        };

        Course.dao.select(function(error, courses) {
            res.render('courses', {
                courses: courses,
                orderSelect: sortOptions.orderSelect,
                sortOrderBox: sortOptions.sortOrderBox,
                sortDateSelect: sortOptions.sortDateSelect,
                paginationTemplate: paginationTemplate
            });
        }, options);
    });
});

module.exports = router;

function SortOptions(field, order, dateOrder) {
    this.orderSelect = {
        sortFields: [{text: 'Рейтингом', value: 'likes'}, {text: 'Іменем', value: 'name'}],
        props: {
            value: field || 'likes',
            onchange: 'this.form.submit()'
        }
    };
    this.sortDateSelect = {
        sortFields: [{text: 'Нові', value: 'desc'}, {text: 'Старі', value: 'asc'}],
        props: {
            value: dateOrder || 'desc',
            onchange: 'this.form.submit()'
        }
    };
    this.sortOrderBox = {
        value: order || 'desc',
        props: {
            value: 'asc',
            onchange: 'this.form.submit()',
            hidden: ''
        }
    };
    if (order) this.sortOrderBox.props.checked = '';

    this.getOptions = function() {
        var order = {};
        order[this.orderSelect.props.value] = this.sortOrderBox.value;
        order['date'] = this.sortDateSelect.props.value;
        return order;
    };
}
