var rename = require('gulp-rename');
var nodeDebug = require('gulp-node-debug');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var path = require('path');

var docx2html = require('../tasks/gulp-docx2html.js');
var unmapper = require('../tasks/gulp-unmapper.js');
var sourceFormatter = require('../tasks/gulp-sourceFormatter.js');
var html2AsciiDoc = require('../tasks/gulp-html2AsciiDoc.js');
var replaceGUIDs = require('../tasks/gulp-replaceGUIDs.js');
var cleanup = require('../tasks/gulp-cleanup.js');
var logger = require('../modules/logger');

var lookupData = {};
var args = {};

var lookupPath = {
  "Android"         : "Android",
  "iOS"             : "iOS",
  "BarCodes"        : "Common-Barccodes",
  "BulletGraph"     : "Common-BulletGraph",
  "DataChart"       : "Common-DataChart",
  "LinearGauge"     : "Common-LinearGauge",
  "PieChart"        : "Common-PieChart",
  "RadialGauge"     : "Common-RadialGauge",
  "CommonControls"  : "XAML-CommonControls",
  "DesignersGuide"  : "XAML-DesignersGuide",
  "GeneralConcepts" : "XAML-GeneralConcepts",
  "WPF"             : "XAML-WPF",
  "Chart"           : "WebAndWin-Chart",
  "DocumentEngine"  : "WebAndWin-DocumentEngine",
  "ExcelEngine"     : "WebAndWin-ExcelEngine",
  "WinForms"        : "WinForms",
  "Xamarin"         : "Xamarin"
};

module.exports.load = function(gulp){

  gulp.task('asciidoc-no-rename', function(callback) {
    
    var onError = function(error){
      gutil.beep();
      logger.log(error);
    };
    return gulp.src('./spec/data/src/*.xml')
      .pipe(plumber(onError))
      .pipe(docx2html())
      .pipe(cleanup('html'))
      .pipe(unmapper())
      .pipe(sourceFormatter())
      .pipe(html2AsciiDoc())
      .pipe(replaceGUIDs(lookupData))
      .pipe(cleanup('asciidoc'))
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
    
    var count = 0;
    
    var onError = function(error){
      gutil.beep();
      logger.log(error);
    };
    return gulp.src('./spec/data/src/*.xml')
      .pipe(plumber(onError))
      .pipe(docx2html())
      .pipe(cleanup('html'))      
      .pipe(unmapper())
      .pipe(sourceFormatter())
      .pipe(html2AsciiDoc())
      .pipe(replaceGUIDs(lookupData))
      .pipe(cleanup('asciidoc'))
      .pipe(rename(function(path){
        path.extname = '.adoc';
        var isJP = path.basename.indexOf('.ja-JP') > -1;
        var guid = path.basename
                              .replace(/\.ja-JP/i, '')
                              .replace(/\{|\}/g, '');
        var name = path.basename
                              .replace(/\.ja-JP/i, '-ja-JP')
                              .replace(/\{|\}/g, '');
        
        if(lookupData[guid]){
          path.basename = lookupData[guid];
          path.basename += isJP ? '.ja-JP' : '';
          
          console.log(path.basename);
          count++;
        } else {
          console.log(`${name} not found in remote data`);
        }
      }))
      .pipe(gulp.dest('./spec/data/dest'))
      .on('end', function(){
        gutil.beep();
        console.log(`${count} files converted`);
        logger.report();
      });
  });
  
  gulp.task('asciidoc', function() {
    
    var fs = require('fs');
    
    args = require('yargs')
                  .usage('Usage: gulp asciidoc $0')
                  .demand(['name'])
                  .argv;

    var lookupDataFilePath = './guid-lookups/' + lookupPath[args.name] + '-lookup.json';
    var duplicateLookupFilePath = './guid-lookups/' + lookupPath[args.name] + '-duplicate.json';
    var doesDuplicatesLookupExist = fs.existsSync(duplicateLookupFilePath);
    
    if(doesDuplicatesLookupExist){
      var duplicates = fs.readFileSync(duplicateLookupFilePath, 'utf8');
      duplicates = JSON.parse(duplicates); 
      duplicates.forEach(function(duplicate){
        console.log('Deleting: ' + duplicate.Guid);
        fs.unlinkSync('./spec/data/src/' + duplicate.Guid + '.xml')
      });
    }
    
    lookupData = JSON.parse(fs.readFileSync(lookupDataFilePath, 'utf8'));
    
    return gulp.start('asciidoc-conversion');
  });
};