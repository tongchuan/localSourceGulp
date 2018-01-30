var browserSync     = require('browser-sync').create();
var gulp            = require('gulp');
var coffee          = require("gulp-coffee");
var gutil           = require("gulp-util");
var sass            = require("gulp-sass");
var sourcemaps      = require("gulp-sourcemaps");
var jade            = require('gulp-jade');
var coffee          = require('gulp-coffee');
// var requirejsOptimize = require('gulp-requirejs-optimize');
var amdOptimize     = require("amd-optimize");
var through         = require("through2");
var concat          = require('gulp-concat');
var nodemon         = require("nodemon");
var cpath           = require("./pathconfig.js");

gulp.task("sass",function(){
  return gulp.src(cpath.sass)
    .pipe(sourcemaps.init())
    //Default: nested Values: nested, expanded, compact, compressed
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cpath.sassDest));
});


gulp.task("jade",function(){
  console.log("========jade========");
  return gulp.src(cpath.jade)
    .pipe(jade({pretty:true}))
    .pipe(gulp.dest(cpath.jadeDest));
});

gulp.task("coffee",function(){
  // amdOptimize.src(cpath.coffee)
  return gulp.src(cpath.coffee)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    // .pipe(through.obj(function(file,enc,cb){
    //   // console.log(file.path);
    //   // for(var iten in file){
    //   //   console.log('---'+iten+":"+file[iten]);
    //   // }
    //   // console.log(file.relative);
    //   // file.pipe(amdOptimize(file.relative))
    //   // file.pipe(concat(file.relative))
    //   // file.pipe(amdOptimize('index'))
    //   this.push(file);
    //   cb();
    // }))
    // .pipe(gulp.dest(cpath.coffeeDest))
    // .pipe(amdOptimize('D:\\code\\web\\snodemon\\src\\script\\layout\\index.js'))
    // .pipe(amdOptimize.src("*",
    //   loader : amdOptimize.loader(
    //     function (){
    //     console.log(name);
    //     return name;
    //   })
    // ))
    // .pipe(concat("ssss.js"))
    .pipe(gulp.dest(cpath.coffeeDest));
});


gulp.task('watch',function(){
  gulp.watch(cpath.sass,['sass']);
  gulp.watch(cpath.jade,['jade']);
  gulp.watch(cpath.coffee,['coffee']);
});

// gulp.task("coffee",function(){
//   // amdOptimize.src(cpath.coffee)
//   return gulp.src("./build/script/layout/**/*.js")
//     // .pipe(coffee({bare: true}).on('error', gutil.log))
//     // .pipe(gulp.dest(cpath.coffeeDest))
//     // .pipe(requirejsOptimize())
//     // .pipe(concat("min.js"))
//     .pipe(gulp.dest("./build"));
// });
//
//
// gulp.task("html",function(){
//   return gulp.src("src/**/*.html")
//     .pipe(gulp.dest("build"));
// });
//
// gulp.task("css",function(){
//   return gulp.src("src/**/*.css")
//     .pipe(gulp.dest("build"));
// });
//
// gulp.task('watch',function(){
//   gulp.watch('./src/**/*.html',['html']);
//   gulp.watch('./src/**/*.js',['script']);
//   gulp.watch('./src/**/*.coffee',['coffee']);
// });
// gulp.task("script",function(){
//   return gulp.src("./src/*.js")
//     .pipe(gulp.dest("build"));
// });
// // gulp.task('coffee', function() {
// //   gulp.src('./src/**/*.coffee')
// //     .pipe(coffee({bare: true}).on('error', gutil.log))
// //     .pipe(gulp.dest('./build/'));
// // });
// gulp.task("server",function(){
//
//   gulp.watch('./src/**').on('change',browserSync.reload);
//   return browserSync.init({
//     server:{
//       baseDir:"./build",
//       directory:false,
//       index:"index.html"
//     },
//     // online:false,
//     // tunnel:'http://www.ztc.com',
//     // https: false,
//     open:true,
//     port:3000,
//     files:["./src/**/*.*"]
//   });
// });


nodemon({
  script: 'app.js',
  ext: '',
  watch:[
    "./src/**/*.*"
  ],
  env:{
    "NODE_ENV":"env",
    "PORT":"3000"
  },
  ignore:['./src','./build']
});


gulp.task('default',['sass','jade','coffee','watch']);
// gulp.task('watch',['sass','jade','coffee','gulpWatch']);
// gulp.task('server',['sass','jade','coffee','server']);
// gulp.task('default',['sass','jade','html','script','coffee','watch']);


nodemon.on('start', function () {
  gulp.watch(['sass','jade','coffee','watch']);
  console.log("start run");
}).on('quit', function () {
  console.log('App has quit');
}).on('restart', function (files) {
  console.log('App restarted due to: ', files);
});
