var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var to5ify = require('6to5ify');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-ruby-sass');
var prefix = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var copy = require('gulp-copy');
var templateCache = require('gulp-angular-templatecache');
var usemin = require('gulp-usemin');
var wiredep = require('wiredep').stream;
var minifyCSS = require('gulp-minify-css');
var gulpif = require('gulp-if');
var SASSDIR = './client/sass/main.scss';
var JSDIR = './client/main.js';

var build = false;

gulp.task('bundle', function() {
  var onError = function( err ) {
    notify.onError({
      title   : "Gulp",
      subtitle: "JS Failure!",
      message : "Error: <%= error.message %>",
      sound   : "Beep"
    })(err);
  };
  browserify(JSDIR, { debug: true })
    .transform(to5ify)
    .bundle()
    .pipe(plumber({ errorHandler: onError }))
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(ngAnnotate())
    .pipe(gulpif(build, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(livereload())
    .pipe(gulp.dest('./build'))
    .pipe(notify("Js Finished!"));
});

gulp.task('sass', function() {
  var onError = function( err ) {
    notify.onError({
      title   : "Gulp",
      subtitle: "Sass Failure!",
      message : "Error: <%= error.message %>",
      sound   : "Beep"
    })(err);
  };
  return sass(SASSDIR)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(prefix("last 10 versions", "> 1%", "ie 8", "ie 7"))
    .pipe(gulpif(build, minifyCSS()))
    .pipe(gulp.dest('./build'))
    .pipe(notify("Sass Finished!"))
    .pipe(livereload());
});

gulp.task('templates', function() {
  gulp.src('./client/**/views/**/**.html')
    .pipe(templateCache({
      standalone: true,
      root      : 'client',
      module    : 'templates'
    }))
    .pipe(gulp.dest('./client/tepmlates'));
});

gulp.task('usemin', function() {
  gulp.src('./index.html')
    .pipe(usemin({
      assetsDir: __dirname,
      js       : [uglify({ mangle: false })],
      css      : [minifyCSS(), 'concat']
    }))
    .pipe(gulp.dest('./production'));
});

gulp.task('live', function() {
  gulp.src(['*.html', './client/**/views/*.html'])
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(['./client/sass/**/*.scss', './client/**/sass/*.scss'], ['sass']),
    gulp.watch('./client/**/*.js', ['bundle']),
    gulp.watch('./bower.json', ['bower']),
    gulp.watch('./client/**/views/*.html', ['live'])
});

gulp.task('bower', function() {
  gulp.src('./index.html', { base: './' })
    .pipe(wiredep())
    .pipe(gulp.dest('./'));
});

gulp.task('build', function() {
  gulp.src(copiedDir, { base: './public' })
    .pipe(gulp.dest('public/build'));
});

gulp.task('dev', ['watch', 'bundle', 'sass']);
gulp.task('prod', ['usemin']);
//gulp.task('default', ['tc']);
