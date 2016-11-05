var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

function Paginator(count, itemsPerPage) {
    this.count = count;
    this.itemsPerPage = itemsPerPage;
}

Paginator.prototype._PAGINATION_PATH = path.join(__dirname, 'pagination.ejs');
Paginator.prototype._PAGINATION_SMALL_PATH = path.join(__dirname, 'pagination-small.ejs');

Paginator.prototype.getPagesCount = function() {
    return Math.ceil(this.count / this.itemsPerPage);
};

Paginator.prototype.getPageOffset = function(page) {
    return (page - 1) * this.itemsPerPage;
};

Paginator.prototype.getPageList = function(page) {
    var pagesCount = this.getPagesCount();
    var pageList = {current: page};
    var pages = [];

    pages.push(1);
    if (page > 3) pages.push(null);

    for (var i = page - 1; i < pagesCount && i < page + 2; i++) {
        if (i > 0 && pages.indexOf(i) < 0) {
            pages.push(i);
        }
    }

    if (pages[pages.length - 1] < pagesCount - 1) pages.push(null);
    pages.push(pagesCount);

    pageList.pages = pages;
    return pageList;
};

Paginator.prototype.render = function(page, url) {
    var pageList = this.getPageList(page);

    var paginationTemplate = fs.readFileSync(this._PAGINATION_PATH).toString();
    var paginationSmallTemplate = fs.readFileSync(this._PAGINATION_SMALL_PATH).toString();

    var pagination = ejs.render(paginationTemplate, {
        pageList: pageList,
        url: getPageUrl.bind(null, url)
    });
    var paginationSmall = ejs.render(paginationSmallTemplate, {
        pageList: pageList,
        url: getPageUrl.bind(null, url),
        pagesCount: this.getPagesCount()
    });

    return {
        pagination: pagination,
        paginationSmall: paginationSmall
    };
};

function getPageUrl(url, page) {
    console.log(page);
    url.query.page = page;
    return url.path + '?' + querystring.stringify(url.query);
}

module.exports = Paginator;