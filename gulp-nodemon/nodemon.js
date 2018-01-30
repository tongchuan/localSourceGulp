var nodemon       = require("nodemon");
var gulp          = require("gulp");
var coffee        = require("gulp-coffee");
var gutil         = require("gulp-util");
nodemon({
  script: 'app.js',
  ext: '',
  watch:[
    "./src/**/*.*"
  ],
  env:{
    "NODE_ENV":"env",
    "PORT":"8000"
  },
  ignore:['./src','./build']
});

gulp.task("html",function(){
  return gulp.src("src/**/*.html")
    .pipe(gulp.dest("build"));
});
gulp.task("css",function(){
  return gulp.src("src/**/*.css")
    .pipe(gulp.dest("build"));
});
gulp.task('watch',function(){
  gulp.watch('./src/**/*.html',['html']);
  gulp.watch('./src/**/*.js',['script']);
  gulp.watch('./src/**/*.coffee',['coffee']);
});
gulp.task("script",function(){
  return gulp.src("./src/*.js")
    .pipe(gulp.dest("build"));
});
gulp.task('coffee', function() {
  gulp.src('./src/**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./build/'));
});

nodemon.on('start', function () {
 gulp.watch(['html','script','coffee','watch']);
  console.log("start run");
}).on('quit', function () {
  console.log('App has quit');
}).on('restart', function (files) {
  console.log('App restarted due to: ', files);
});
