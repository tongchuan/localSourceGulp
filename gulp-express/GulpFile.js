var gulp 			=	require('gulp');
var gutil 			=	require('gulp-util');
var browserSync		=	require('browser-sync');
var sass 			=	require('gulp-sass');
var autoprefixer	=	require('gulp-autoprefixer');
var concat 			= 	require('gulp-concat');
var cssmin			=	require('gulp-cssmin');
var rename			=	require('gulp-rename');
var uglify			=	require('gulp-uglify');
var zip				=	require('gulp-zip');
var nodemon			=	require('gulp-nodemon');
var sourcemaps		=	require('gulp-sourcemaps');
var jade 			=	require('gulp-jade');
var coffee			=	require('gulp-coffee');
var del				=	require('del');
var gulpSequence	=	require('gulp-sequence');
var reload 			=	browserSync.reload;

gulp.task('nodemon', function(cb){
	var called		=	false;
	return nodemon({
		script: 'bin/www'
	}).on('start', function(){
		if(!called){
			cb();
			called = true;
		}
	});
});


gulp.task('browser', ['nodemon'], function(){
	browserSync.init(null,{
		proxy: 'http://localhost:3000',
	    files: ['src/**/*.*', 'src/views/**/*.*'],
	    browser: 'google chrome',
	    notify: false,
	    port: 5000
	});
});

gulp.task('style:clear',function(){
		// del(['./build/style/**/*.css','!./build/style/base/**/*.css'],{force:true,dryRun:true}).then(function(path){
	// return gulp.src()
	del(['./build/style/**/*.*','./src/static/css/**/*.*'],{force:true,dryRun:true}).then(function(path){
		// console.log('del'+path)
		console.log('del style')
	});
});

// gulp.task('style:sass',['style:clear'],function(){
gulp.task('style:sass',['style:clear'],function(){
		return gulp.src('./src/static/sass/**/*.scss')
			.pipe(sass()).on('error',gutil.log)
			.pipe(autoprefixer())
			.pipe(gulp.dest('./src/static/css'));
	
});
gulp.task('style:css',['style:sass'],function(){
	// del(['./build/style/**/*.css']).then(function(path){
	return gulp.src('./src/static/css/**/*.css')
			.pipe(concat('main.css'))
			.pipe(gulp.dest('./build/style'));
	// });
});
gulp.task('style:min',['style:css'],function(){
	return gulp.src('./build/style/main.css')
			.pipe(sourcemaps.init())
			.pipe(cssmin())
        	.pipe(rename({suffix: '.min'}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./build/style'));

});

gulp.task('script:clear',function(){
	del(['./build/script/**/*.*','./src/static/js/**/*.*'],{force:true,dryRun:true}).then(function(path){
		console.log('del javascript')
	});
});

gulp.task('coffee',['script:clear'],function(){
	return gulp.src('./src/static/script/**/*.coffee')
			// .pipe(sourcemaps.init())
			.pipe(coffee({bare:true})).on('error',gutil.log)
			// .pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./src/static/js'))
			.pipe(gulp.dest('./build/script'))
});
gulp.task('script:app',['coffee'],function(){
	return gulp.src('./src/static/js/**/*.js')
			// .pipe(gulp.dest('./build/script'))
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(rename({suffix: '.min'}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./build/script'))
});
gulp.task('script:lib',function(){
	return gulp.src(['./src/static/script/lib/jquery.js','./src/static/script/lib/require.js'])
		.pipe(concat('core.js'))
		// .pipe(sourcemaps.init())
		// .pipe(uglify())
		// .pipe(sourcemaps.write('./'))
		// .pipe(gulp.dest('./src/static/js/lib'))
		// .pipe(gulp.dest('./build/script/lib'))
		.pipe(gulp.dest('./src/static/js/lib'))
		.pipe(gulp.dest('./build/script/lib'))
});
gulp.task('script:min',['script:lib','script:app']);


gulp.task('zip',['style:min','coffee'],function(){
	return gulp.src('./build/*')
			.pipe(zip('build.zip'),{compress:true})
			// .pipe(zip('build.compress.zip'),{compress:false})
			.pipe(gulp.dest('./'));
})


gulp.task('default',['script:min','style:min','browser'],function(){
	gulp.watch(['src/static/sass/**/*.scss'],['style:min']);
	gulp.watch(['src/static/script/**/*.coffee'],['script:min']);
});