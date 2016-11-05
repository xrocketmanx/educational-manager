var express = require('express');
var router = express.Router();
var Paginator = require('../utils/paginator');
var Course = require('../model/course');

router.get('/', function(req, res) {
    var sortOptions = new SortOptions(req.query['order'], req.query['dir'], req.query['sort-date']);
    var options = {order: sortOptions.getOptions()};

    Course.dao.count(function(error, count) {
        var page = +req.query['page'] || 1;
        var paginator = new Paginator(count, 6);

        options.limit = {
            num: paginator.itemsPerPage,
            offset: paginator.getPageOffset(page)
        };

        Course.dao.select(function(error, courses) {
            res.render('courses', {
                courses: courses,
                sortOptions: sortOptions,
                sortFields: sortOptions.sortFields,
                dateOrders: sortOptions.dateOrders,
                sortQuery: sortOptions.getAsQueryParams(),
                pageList: paginator.getPageList(page),
                pageCount: paginator.getPagesCount()
            });
        }, options);
    });
});

module.exports = router;

function SortOptions(field, order, dateOrder) {
    this.sortFields = [{name: 'Рейтингом', field: 'likes'}, {name: 'Іменем', field: 'name'}];
    this.dateOrders = [{name: 'Нові', value: 'desc'}, {name: 'Старі', value: 'asc'}];
    this.field = field || this.sortFields[0].field;
    this.order = order || 'desc';
    this.dateOrder = dateOrder || this.dateOrders[0].value;

    this.getOptions = function() {
        var order = {};
        order[this.field] = this.order;
        order['date'] = this.dateOrder;
        return order;
    };

    this.getAsQueryParams = function() {
        var query = 'order=' + this.field;
        query += '&dir=' + this.order;
        query += '&sort-date=' + this.dateOrder;
        return query;
    }
}