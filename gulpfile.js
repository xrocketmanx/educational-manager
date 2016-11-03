var fs          = require('fs');
var gulp        = require('gulp'),
	less        = require('gulp-less'),
	concat      = require('gulp-concat'),
	del         = require('del'),
	uglify      = require('gulp-uglifyjs'),
	cleancss    = require('gulp-clean-css'),
	merge       = require('merge-stream');

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
	};

	function getDirPath(tree, dir) {
		for (var i in tree) {
			if (tree.hasOwnProperty(i)) {
				if (typeof tree[i] === 'string' && tree[i] === dir) {
					return tree[i] + '/';
				} else if (typeof tree[i] === 'object') {
					if (i === dir) return i + '/';
					var recursive = getDirPath(tree[i], dir);
					if (recursive) return i + '/' + recursive;
				}
			}
		}
		return null;
	}

	return {
		get: function(dir) {
			return dir === './' ? base : base + getDirPath(dirs, dir);
		},
		getFolders: function(dir) {
			var base = this.get(dir);
			return fs.readdirSync(base).filter(function(file) {
		    	return fs.statSync(base + file).isDirectory();
		    });
		}
	};
})();

gulp.task('less', function() {
	return gulp.src(paths.get('less') + '*.less')
		.pipe(less())
		.pipe(gulp.dest(paths.get('css')));
});

gulp.task('js', function() {
	var jsFolder = paths.get('js');
	var folders = paths.getFolders('js');
	var tasks = folders.map(function(folder) {
		return gulp.src(jsFolder + folder + '/**/*js')
			.pipe(concat(folder + '.js'))
			.pipe(gulp.dest(jsFolder));
	});
	return merge(tasks);
});

gulp.task('clean', function() {
	return del.sync(paths.get('build'));
});

gulp.task('build', ['clean', 'less', 'js'], function() {
	var js = gulp.src(paths.get('js') + '*.js')
		.pipe(uglify())
		.pipe(gulp.dest(paths.get('build') + 'scripts/js/'));
	var libs = gulp.src(paths.get('scripts') + 'libs/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(paths.get('build') + 'scripts/libs/'));
	var css = gulp.src(paths.get('css') + '*.css')
		.pipe(cleancss())
		.pipe(gulp.dest(paths.get('build') + 'styles/css/'));
	var img = gulp.src(paths.get('img') + '**/*')
		.pipe(gulp.dest(paths.get('build') + 'img/'));
});

gulp.task('watch', ['less', 'js'], function () {
	gulp.watch(paths.get('less') + '**/*.less', ['less']);
	gulp.watch([paths.get('js') + '**/*.js'], ['js']);
});

gulp.task('default', ['watch']);
