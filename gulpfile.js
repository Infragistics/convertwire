var gulp = require('gulp');
var nodeDebug = require('gulp-node-debug');
var docx2html = require('./modules/gulp-docx2html.js');
var rename = require('gulp-rename');

gulp.task('default', function() {
  return gulp.src('./spec/data/*.xml')
    .pipe(docx2html())
    .pipe(rename(function(path){
      path.extname = '.adoc';
    }))
    .pipe(gulp.dest('./spec/data/done'));
});