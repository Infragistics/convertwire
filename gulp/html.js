var rename = require('gulp-rename');
var nodeDebug = require('gulp-node-debug');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var docx2html = require('../tasks/gulp-docx2html.js');
var unmapper = require('../tasks/gulp-unmapper.js');
var sourceFormatter = require('../tasks/gulp-sourceFormatter.js');
var html2AsciiDoc = require('../tasks/gulp-html2AsciiDoc.js');
var logger = require('../modules/logger');

module.exports.load = function(gulp){
  gulp.task('html-only', function() {
    return gulp.src('./spec/data/src/*.xml')
      .pipe(docx2html())
      .pipe(rename(function(path){
        path.extname = '.html';
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
};