var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var path = require('path');
var bom = require('gulp-bom');

var docx2html = require('../tasks/gulp-docx2html.js');
var unmapper = require('../tasks/gulp-unmapper.js');
var layoutTables = require('../tasks/gulp-layoutTables.js');
var sourceFormatter = require('../tasks/gulp-sourceFormatter.js');
var html2AsciiDoc = require('../tasks/gulp-html2AsciiDoc.js');
var replaceGUIDs = require('../tasks/gulp-replaceGUIDs.js');
var cleanup = require('../tasks/gulp-cleanup.js');
var logger = require('../modules/logger');

var lookupData = {};
var args = {};

var lookupPath = {
  "Android"         : "Android",
  "ASPNET"          : "ASPNET",
  "iOS"             : "iOS",
  "Barcodes"        : "Barcodes",
  "BulletGraph"     : "BulletGraph",
  "DataChart"       : "DataChart",
  "LinearGauge"     : "LinearGauge",
  "PieChart"        : "PieChart",
  "RadialGauge"     : "RadialGauge",
  "CommonControls"  : "CommonControls",
  "DesignersGuide"  : "DesignersGuide",
  "GeneralConcepts" : "GeneralConcepts",
  "WPF"             : "WPF",
  "Chart"           : "Chart",
  "DocumentEngine"  : "DocumentEngine",
  "ExcelEngine"     : "ExcelEngine",
  "WinForms"        : "WinForms",
  "Xamarin"         : "Xamarin",
  "Silverlight"     : "sl",
  "ta-hp"           : "winforms-ta-hp",
  "ta-rft"          : "winforms-ta-rft",
  "ta-wpf"          : "wpf-ta",
  "SurfaceChart"    : "surfacechart",
  "DoughnutChart"   : "doughnutchart",
  "FunnelChart"     : "funnelchart",
  "Spreadsheet"     : "spreadsheet",
  "DataGrid"        : "datagrid"
};

module.exports.load = function(gulp){
    
    gulp.task('html2adoc', (callback) => {
        var onError = function(error){
            gutil.beep();
            logger.log(error);
        };
        return gulp.src('./spec/data/src/*.html')
        .pipe(plumber(onError))
        .pipe(html2AsciiDoc())
        .pipe(cleanup('asciidoc'))
        .pipe(rename(function(path){
            path.extname = '.adoc';
        }))
        .pipe(bom())
        .pipe(gulp.dest('./spec/data/dest'))
        .on('end', function(){
            gutil.beep();
            logger.report();
        });
    });

  gulp.task('asciidoc-no-rename', function(callback) {
    
    var onError = function(error){
      gutil.beep();
      logger.log(error);
    };
    return gulp.src('./spec/data/src/*.xml')
      .pipe(plumber(onError))
      .pipe(docx2html())
      .pipe(cleanup('html'))
      .pipe(layoutTables())
      .pipe(unmapper())
      .pipe(sourceFormatter())
      .pipe(html2AsciiDoc())
      .pipe(replaceGUIDs(lookupData))
      .pipe(cleanup('asciidoc'))
      .pipe(rename(function(path){
        path.extname = '.adoc';
      }))
      .pipe(bom())      
      .pipe(gulp.dest('./spec/data/dest'))
      .on('end', function(){
        gutil.beep();
        logger.report();
      });
  });
  
  gulp.task('rename', function(callback) {
    
    var count = 0;
    
    var onError = function(error){
      gutil.beep();
      logger.log(error);
    };
    
    var srcPath = './spec/data/src/*.xml';
        
    if(/^en$/i.test(args.lang)) {
        srcPath = ['!./spec/data/src/*.ja-JP.xml','./spec/data/src/*.xml'];
    } else if(/^jp$/i.test(args.lang)) {
        srcPath = './spec/data/src/*.ja-JP.xml';
    }
    
    return gulp.src(srcPath)
      .pipe(plumber(onError))
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
          console.log(`${name} not found in lookup data`);
        }
      }))
      .pipe(bom())
      .pipe(gulp.dest('./spec/data/dest'))
      .on('end', function(){
        gutil.beep();
        console.log(`${count} files converted`);
        logger.report();
      });
  });
  
  gulp.task('asciidoc-conversion', function(callback) {
    
    var count = 0;
    
    var onError = function(error){
      gutil.beep();
      logger.log(error);
    };
    
    var srcPath = './spec/data/src/*.xml';
        
    if(/^en$/i.test(args.lang)) {
        srcPath = ['!./spec/data/src/*.ja-JP.xml','./spec/data/src/*.xml'];
    } else if(/^jp$/i.test(args.lang)) {
        srcPath = './spec/data/src/*.ja-JP.xml';
    }
    
    return gulp.src(srcPath)
      .pipe(plumber(onError))
      .pipe(docx2html())
      .pipe(cleanup('html'))
      .pipe(layoutTables())
      .pipe(unmapper())
      .pipe(sourceFormatter())
      .pipe(html2AsciiDoc())
      .pipe(replaceGUIDs(lookupData))
      .pipe(cleanup('asciidoc', args.name))
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
      .pipe(bom())
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

    var lookupDataFilePath = './guid-lookups/' + lookupPath[args.name].toLowerCase() + '-lookup.json';
    var duplicateLookupFilePath = './guid-lookups/' + lookupPath[args.name] + '-duplicate.json';
    var doesDuplicatesLookupExist = fs.existsSync(duplicateLookupFilePath);
    
    console.log('\nStarting conversion.');    
    
    if(doesDuplicatesLookupExist){
      
      console.log('\nReading duplicates...\n');
      
      var duplicates = fs.readFileSync(duplicateLookupFilePath, 'utf8');
      duplicates = JSON.parse(duplicates);
       
      duplicates.forEach(function(duplicate){
        if(fs.existsSync(path.resolve(__dirname, '../spec/data/src/' + duplicate.Guid + '.xml'))){
          console.log('Deleting: ' + duplicate.Guid + '.xml');
          fs.unlinkSync('./spec/data/src/' + duplicate.Guid + '.xml')
        }
        if(fs.existsSync(path.resolve(__dirname, '../spec/data/src/' + duplicate.Guid + '.ja-JP.xml'))){
          console.log('Deleting: ' + duplicate.Guid + '.ja-JP.xml');
          fs.unlinkSync('./spec/data/src/' + duplicate.Guid + '.ja-JP.xml')
        }
      });
      
      console.log('\nDone reading duplicates.\n');
      
    }
    
    console.log('\nReading lookup data.\n');
    lookupData = JSON.parse(fs.readFileSync(lookupDataFilePath, 'utf8'));
    
    console.log('\nStarting conversion task.\n');
    
    if(args.rename) {
      return gulp.start('rename');
    }
    
    return gulp.start('asciidoc-conversion');
  });
};