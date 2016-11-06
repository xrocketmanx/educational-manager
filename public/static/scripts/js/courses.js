$(document).ready(function() {
    $('.like').click(function(event) {
        event.preventDefault();
        var $anchor = $(this);
        $.post($anchor.attr('href'), function(course) {
            $anchor.text(course.likes);
        });
    });
});