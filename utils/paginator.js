function Paginator(count, itemsPerPage) {
	this.count = count;
	this.itemsPerPage = itemsPerPage;
}

Paginator.prototype.getPagesCount = function() {
	return Math.ceil(this.count / this.itemsPerPage);
};

Paginator.prototype.getPageOffset = function(page) {
	return (page - 1) * this.itemsPerPage;
};

Paginator.prototype.getPageList = function(page) {
	var pagesCount = this.getPagesCount();
	var pageList = { current: page };
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

module.exports = Paginator;