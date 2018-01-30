在gulp工程下编写自己的requirejs组建路径问题
#问题描述
一般我们在用requirejs的时候，用define方法引入我们自己的组建或公共类，路径不是我们生产环节的路径，我们这时候需要动态替换引入的路径。
#解决办法
自己创建一个工具最好；
用through2组建很不错，我们可以读取文件的名称，文件内容等
直接使用
创建自己的工具文件夹及文件
#mkdir Tools && cd Tools
创建package.json
#npm init
创建自己index.js文件
#touch index.js
#vi index.js
//code start
'use strict';
var gutil		=	require('gulp-util');
var through 	=	require('through2');

module.exports = function(options){
	return through.obj(function(file,enc,cb){
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return cb();
		}
		if(typeof options=='object'){
			var content = file.contents.toString();
			for(var item in options){
				// console.log(options[item])
				var reg = new RegExp(item,"igm");
				content = content.replace(reg,options[item]);
			}
			file.contents = new Buffer(content);
		}
		this.push(file);	
		cb();
	});
}
//code end

注意package.json 文件
"main": "index.js",
安装through2
#npm install through2 --save-dev
到我们工程目录下
#cd ..
gulpfile.js文件用
引入
var Tools = require("./Tools");
javascript压缩完成后
gulp.task("js",function(){
  return gulp.src("app/js/**/*.js")
    .pipe(uglify())
		.pipe(Tools({
		  'a/b/c.js','/porjes/a/b/c.js',//可以配置多个对应的路径
		  'a/b/cd.js','/porjes/a/b/cd.js'
		}))
		.pipe(gulp.dest('build'));
})；

