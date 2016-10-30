var gulp        = require('gulp'),
	browserSync = require('browser-sync'),
	less        = require('gulp-less'),
	concat      = require('gulp-concat'),
	del         = require('del'),
	uglify      = require('gulp-uglifyjs'),
	cleancss    = require('gulp-clean-css');

var paths = (function() {
	var base = "public/static/";
	var dirs = {
		styles: {
			less: "less",
			css: "css"
		},
		scripts: {
			js: "js",
			libs: "libs"
		},
		build: 'build',
		img: 'img'
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
	return gulp.src([paths.get('js') + '**/*.js', '!' + paths.get('js') + 'script.js'])
		.pipe(concat('script.js'))
		.pipe(gulp.dest(paths.get('js')))
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

gulp.task('clean', function() {
	return del.sync(paths.get('build'));
});

gulp.task('build', ['clean', 'less', 'js', 'templates'], function() {
	var js = gulp.src(paths.get('js') + 'script.js')
		.pipe(uglify())
		.pipe(gulp.dest(paths.get('build') + 'scripts/js/'));
	var css = gulp.src(paths.get('css') + '*.css')
		.pipe(cleancss())
		.pipe(gulp.dest(paths.get('build') + 'styles/css/'));
	var img = gulp.src(paths.get('img') + '**/*')
		.pipe(gulp.dest(paths.get('build') + 'img/'));
	var html = gulp.src(paths.get('./') + '**/*.html')
		.pipe(gulp.dest(paths.get('build')));
});

gulp.task('watch', ['less', 'js'], function () {
	gulp.watch(paths.get('less') + '**/*.less', ['less']);
	gulp.watch([paths.get('js') + '**/*.js', '!' + paths.get('js') + 'script.js'], ['js']);
	//gulp.watch(paths.get('templates') + '**/*.ejs', ['templates']);
});

gulp.task('watch-sync', ['browserSync', 'watch']);
