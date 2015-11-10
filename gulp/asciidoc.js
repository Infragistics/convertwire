var rename = require('gulp-rename');
var nodeDebug = require('gulp-node-debug');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var docx2html = require('../tasks/gulp-docx2html.js');
var unmapper = require('../tasks/gulp-unmapper.js');
var sourceFormatter = require('../tasks/gulp-sourceFormatter.js');
var html2AsciiDoc = require('../tasks/gulp-html2AsciiDoc.js');
var replaceGUIDs = require('../tasks/gulp-replaceGUIDs.js');
var cleanup = require('../tasks/gulp-cleanup.js');
var logger = require('../modules/logger');

var remoteData = {};

module.exports.load = function(gulp){

  gulp.task('asciidoc-no-rename', function(callback) {
    
    var onError = function(error){
      gutil.beep();
      logger.log(error);
    };
    return gulp.src('./spec/data/src/*.xml')
      .pipe(plumber(onError))
      .pipe(docx2html())
      .pipe(unmapper())
      .pipe(sourceFormatter())
      .pipe(html2AsciiDoc())
      .pipe(replaceGUIDs(remoteData))
      .pipe(cleanup())
      .pipe(rename(function(path){
        path.extname = '.adoc';
      }))
      .pipe(gulp.dest('./spec/data/dest'))
      .on('end', function(){
        gutil.beep();
        logger.report();
      });
  });
  
  gulp.task('asciidoc-conversion', function(callback) {
    
    var onError = function(error){
      gutil.beep();
      logger.log(error);
    };
    return gulp.src('./spec/data/src/*.xml')
      .pipe(plumber(onError))
      .pipe(docx2html())
      .pipe(unmapper())
      .pipe(sourceFormatter())
      .pipe(html2AsciiDoc())
      .pipe(cleanup())
      .pipe(replaceGUIDs(remoteData))
      .pipe(rename(function(path){
        path.extname = '.adoc';
        var isJP = path.basename.indexOf('.ja-JP') > -1;
        var name = path.basename.replace(/\.ja-JP/i, '-ja-JP');
        
        if(remoteData[name]){
          path.basename = remoteData[name];
          path.basename += isJP ? '.ja-JP' : '';
          
          console.log(path.basename);
        }
      }))
      .pipe(gulp.dest('./spec/data/dest'))
      .on('end', function(){
        gutil.beep();
        logger.report();
      });
  });
  
  gulp.task('asciidoc', function(){
    
    var fs = require('fs')
    var path = require('path');
    var args = {};
    
    if(fs.existsSync(path.resolve(__dirname, './credentials.json'))){
      var credentials = fs.readFileSync(path.resolve(__dirname, './credentials.json'), 'utf8');
      credentials = JSON.parse(credentials);
      
      args = require('yargs')
                  .usage('Usage: gulp asciidoc $0')
                  .demand(['name'])
                  .argv;
      
      args.username = credentials.username;
      args.password = credentials.password; 
      
    } else {
      args = require('yargs')
                  .usage('Usage: gulp asciidoc $0 $1 $2')
                  .demand(['username', 'password', 'name'])
                  .argv;
    }
                
    var repository = require('../modules/firebaseRepository');  
    repository.get(args.username, args.password, args.name, function(snap){
      remoteData = snap.val();            
      console.log(Object.keys(remoteData).length + ' names loaded');
      console.log('Starting AsciiDoc conversion...');
      
      return gulp.start('asciidoc-conversion');
    });
  });
};