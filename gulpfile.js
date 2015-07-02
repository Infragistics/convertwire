var gulp = require('gulp');
var nodeDebug = require('gulp-node-debug');
var docx2html = require('./tasks/gulp-docx2html.js');
var unmapper = require('./tasks/gulp-unmapper.js');
var rename = require('gulp-rename');

gulp.task('default', function() {
  return gulp.src('./spec/data/*.xml')
    .pipe(docx2html())
    .pipe(unmapper())
    .pipe(rename(function(path){
      path.extname = '.html';
    }))
    .pipe(gulp.dest('./spec/data/done'));
});