var gulp = require('gulp');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var nodeDebug = require('gulp-node-debug');

var docx2html = require('./tasks/gulp-docx2html.js');
var unmapper = require('./tasks/gulp-unmapper.js');
var sourceFormatter = require('./tasks/gulp-sourceFormatter.js');
var html2AsciiDoc = require('./tasks/gulp-html2AsciiDoc.js');

gulp.task('asciidoc', function() {
  return gulp.src('./spec/data/src/*.xml')
    .pipe(docx2html())
    .pipe(unmapper())
    .pipe(sourceFormatter())
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
    .pipe(sourceFormatter())
    .pipe(rename(function(path){
      path.extname = '.html';
    }))
    .pipe(gulp.dest('./spec/data/dest'));
});

gulp.task('html-no-format', function() {
  return gulp.src('./spec/data/src/*.xml')
    .pipe(docx2html())
    .pipe(unmapper())
    .pipe(rename(function(path){
      path.extname = '.html';
    }))
    .pipe(gulp.dest('./spec/data/dest/no-format'));
});

gulp.task('html-no-unmapper', function() {
  return gulp.src('./spec/data/src/*.xml')
    .pipe(docx2html())
    .pipe(rename(function(path){
      path.extname = '.html';
    }))
    .pipe(gulp.dest('./spec/data/dest/no-unmapper'));
});

gulp.task('clean', function(){
  return gulp.src('./spec/data/dest/**')
    .pipe(clean());
});

gulp.task('default', ['clean', 'asciidoc']);