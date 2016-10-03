module = module.exports;

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const os = require('os');

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
  "DataGrid"        : "datagrid",
  "win-universal"   : "win-universal"
};

args = require('yargs')
                .usage('Usage: node diff.js $0')
                .demand(['name'])
                .argv;

var lookupDataFilePath = '../../guid-lookups/' + lookupPath[args.name].toLowerCase() + '-lookup.json';
console.log('\nReading lookup data.\n');
lookupData = JSON.parse(fs.readFileSync(lookupDataFilePath, 'utf8'));  

var diff = (rootPath) => {
    var sourcePath = path.join(rootPath, 'dest', 'html');
    //var sourcePath = path.join(rootPath, 'src');
    var destPath = path.join(rootPath, 'dest');
    var renamePath = path.join(rootPath, 'dest-rename');
    var diffPath = path.join(rootPath, 'dest-diff');


    var path1Files = fs.readdirSync(destPath);
    var path2Files = fs.readdirSync(renamePath);
    var diffFiles = [];

    console.log('detecting differences');
    
    diffFiles = _.difference(path2Files, path1Files);

    var keys = _.keys(lookupData);
    var isJP = false;
    var fileNameNoExtension;
    var jpPattern = /\.ja-JP/i;
    var fileNameToCopy = '';
    var fileExists = true;

    console.log(`There are ${diffFiles.length} diff files.`);

    if(!fs.existsSync(diffPath)){
        fs.mkdir(diffPath);
    }

    diffFiles.forEach((fileName) => {
        keys.forEach((key) => {
            isJP = jpPattern.test(fileName);

            fileNameNoExtension = fileName.replace(/\.adoc/, '').replace(jpPattern, '');

            if(lookupData[key] === fileNameNoExtension){
                fileNameToCopy = key + (isJP?'.ja-JP': '') + '.html';
                //fileNameToCopy = key + (isJP?'.ja-JP': '') + '.xml';
                
                var hasBraces = !fs.existsSync(path.join(sourcePath, fileNameToCopy));

                if(hasBraces){
                    fileNameToCopy = '{' + key + '}' + (isJP?'.ja-JP': '') + '.xml';                
                    fileExists = fs.existsSync(path.join(sourcePath, fileNameToCopy));
                }

                console.log(fileNameToCopy);

                if(fileExists){
                    fs.createReadStream(path.join(sourcePath, fileNameToCopy)).pipe(fs.createWriteStream(path.join(diffPath, fileNameToCopy)))
                }
            }
        });
    });
    
    console.log('done');
};

diff(`C:\\Users\\cshoemaker\\Documents\\Code\\convertwire\\spec\\data`);