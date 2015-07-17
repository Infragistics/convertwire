var gulp = require('gulp');
var nodeDebug = require('gulp-node-debug');
var docx2html = require('./tasks/gulp-docx2html.js');
var unmapper = require('./tasks/gulp-unmapper.js');
var html2AsciiDoc = require('./tasks/gulp-html2AsciiDoc.js');
var rename = require('gulp-rename');
var clean = require('gulp-clean');

gulp.task('asciidoc', function() {
  return gulp.src('./spec/data/src/*.xml')
    .pipe(docx2html())
    .pipe(unmapper())
    .pipe(html2AsciiDoc())
    .pipe(rename(function(path){
      path.extname = '.adoc';
    }))
    .pipe(gulp.dest('./spec/data/dest'));
});

gulp.task('html', function() {
  return gulp.src('./spec/data/src/*.xml')
    .pipe(docx2html())
    .pipe(unmapper())
    .pipe(rename(function(path){
      path.extname = '.html';
    }))
    .pipe(gulp.dest('./spec/data/dest'));
});

gulp.task('clean', function(){
  return gulp.src('./spec/data/dest/**')
    .pipe(clean());
});

gulp.task('default', ['clean', 'asciidoc']);