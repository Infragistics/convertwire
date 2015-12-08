var gulp = require('gulp');
var clean = require('gulp-clean');

require('./gulp/asciidoc.js').load(gulp);
require('./gulp/html.js').load(gulp);

gulp.task('clean', function(){
  return gulp.src('./spec/data/dest/**')
    .pipe(clean());
});

gulp.task('default', ['asciidoc', 'html-no-format', 'html']);