function SortOptions(field, order, dateOrder) {
    this.orderSelect.props.value = field || 'likes';

    this.sortDateSelect.props.value= dateOrder || 'desc';

    this.sortOrderBox.value = order || 'desc';
    if (order) {
        this.sortOrderBox.props.checked = '';
    } else {
        delete this.sortOrderBox.props.checked;
    }
}

SortOptions.prototype.orderSelect = {
    sortFields: [{text: 'Рейтингом', value: 'likes'}, {text: 'Іменем', value: 'name'}],
    props: {
        onchange: 'this.form.submit()'
    }
};

SortOptions.prototype.sortDateSelect = {
    sortFields: [{text: 'Нові', value: 'desc'}, {text: 'Старі', value: 'asc'}],
    props: {
        onchange: 'this.form.submit()'
    }
};

SortOptions.prototype.sortOrderBox = {
    props: {
        value: 'asc',
        onchange: 'this.form.submit()',
        hidden: ''
    }
};

SortOptions.prototype.getOptions = function() {
    var order = {};
    order[this.orderSelect.props.value] = this.sortOrderBox.value;
    order['date'] = this.sortDateSelect.props.value;
    return order;
};

module.exports = SortOptions;
