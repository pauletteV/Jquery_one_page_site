//to call gulp task with Node Env as production:  NODE_ENV='production' gulp

var gulp = require('gulp');
var minify = require('gulp-minify');
var sassProcess = require('gulp-sass');
var gutil = require('gulp-util');
var gulpIf = require('gulp-if');
var images = require('gulp-imagemin');
/*var cache = require('gulp-cache');*/

//sources:
var env,
	jsSources,
	sassSources,
	jsonSources;
	outputDir;


//env = process.env.NODE_ENV || 'development'; /* to toggele dev vs. build mode for gulp-if tasks*/
if (env === 'development') {
  outputDir = 'builds/development/';
} else {
  outputDir = 'builds/public/';
}

jsSources = ['builds/development/js/logic.js'];
sassSources = ['builds/development/sass/styles.scss'];

//tasks: 
gulp.task('sass', function(){
	return gulp.src(sassSources)
		.pipe(sassProcess())
		.on('error', gutil.log())
		.pipe(gulp.dest(outputDir + 'css'));

});

gulp.task('watch', function(){
	gulp.watch(sassSources, ['sass']);
});

//minify any .js files for public folder using gulp-if
gulp.task('jsMin', function(){
	return gulp.src(jsSources)
		//if end up with multiple js files add the gulp-concat plugin to merge
		.pipe(gulpIf(env === 'production', minify()))
		.pipe(gulp.dest(outputDir + 'js'));
});

gulp.task('images', function() {
  return gulp.src('builds/development/images/**/*.*')
    		.pipe(gulpIf(env === 'production', imagemin({
      				progressive: true,
      				svgoPlugins: [{ removeViewBox: false }],
      				use: [pngcrush()]
    		})))
    		.pipe(gulpIf(env === 'production', gulp.dest(outputDir + 'images')))
});

gulp.task('html', function(){
	return gulp.src('builds/development/index.html')
		.pipe(gulpIf(env === "production"), gulp.dest(outputDir)); 

});

gulp.task('default', ['sass', 'watch', 'jsMin', 'images', 'html']);

