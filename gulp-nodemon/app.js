var browserSync     = require('browser-sync');
var gulp            = require('gulp');


browserSync.init({
  server:{
    baseDir:"./build",
    directory:false,
    index:"index.html"
  },
  online:false,
  https: false,
  open:true,
  port:3000,
  files:["./src/**/*.*"]
});
