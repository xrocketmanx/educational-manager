var gulp        = require('gulp');
var browserSync = require('browser-sync');
var less        = require('gulp-less');
var concat      = require('gulp-concat');

var paths = (function() {
	var base = "public/";
	var dirs = {
		styles: {
			less: "less",
			css: "css"
		},
		scripts: 'scripts'
	}

	function getDirPath(tree, dir) {
		for (var i in tree) {
			if (typeof tree[i] === 'string' && tree[i] === dir) {
				return tree[i] + '/';
			} else if (typeof tree[i] === 'object') {
				var recursive = getDirPath(tree[i], dir);
				if (recursive) return i + '/' + recursive;
			}
		}
		return null;
	}

	return {
		get: function(dir) {
			return dir === './' ? base : base + getDirPath(dirs, dir);
		}
	};
})();

gulp.task('less', function() {
	return gulp.src(paths.get('less') + '*.less')
	.pipe(less())
	.pipe(gulp.dest(paths.get('css')))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src([paths.get('scripts') + '**/*.js', '!' + paths.get('scripts') + 'script.js'])
	.pipe(concat('script.js'))
	.pipe(gulp.dest(paths.get('scripts')))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: paths.get('./')
		},
		notify: false
	});
});

gulp.task('watch', ['browserSync', 'less', 'js'], function() {
	gulp.watch(paths.get('less') + '**/*.less', ['less']);
	gulp.watch([paths.get('scripts') + '**/*.js', '!' + paths.get('scripts') + 'script.js'], ['js']);
	gulp.watch(paths.get('./') + '*.html', browserSync.reload);
});