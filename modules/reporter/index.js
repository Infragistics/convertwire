module = module.exports;

const os = require('os');

var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');

module.getRandomFileNames = (folderPath, count, groupCount, english) => {
	var randoms, basePath, fileNames, fileCount, index;

	randoms = [];

	basePath = path.resolve(__dirname, folderPath);
	fileNames = fs.readdirSync(basePath);
	fileNames = fileNames.filter((fileName) => {
		if(english){
			return fileName.indexOf('.ja-JP') === -1;
		} else {
			return fileName.indexOf('.ja-JP') !== -1;
		}
	});
	fileCount = fileNames.length;

	for (var g = 0; g < groupCount; g++) {
		for (var i = 0; i < count; i++) {
			index = Math.floor(Math.random() * fileCount);
			if (!_.contains(randoms, fileNames[index])) {
				randoms.push(fileNames[index]);
			} else {
				i--;
			}
		}
		randoms.push(os.EOL);
	}
	
	var nameSuffix = english? '' : '-ja-JP';

	fs.writeFileSync(path.resolve(__dirname, `../../logs/randomNames${nameSuffix}.txt`), randoms.join(os.EOL), 'utf8');
	
	console.log('names generated');
};

var isTablesDirectoryCreated = false;
var isTablesComplexDirectoryCreated = false;

module.crazyTables = function (folderPath) {
	var basePath, fileNames, matches, results = [], title = '';

	basePath = path.resolve(__dirname, folderPath);
	fileNames = fs.readdirSync(basePath);

	fileNames.forEach((fileName) => {
		var filePath, contents;

		filePath = path.join(basePath, fileName);
		contents = fs.readFileSync(filePath, 'utf8');

		if (contents.indexOf('colspan') > -1 ||
			contents.indexOf('rowspan') > -1 ||
			contents.indexOf('colSpan') > -1 ||
			contents.indexOf('rowSpan') > -1) {
			
			matches = contents.match(/name&quot;: &quot;(.*)&/);
			
			if(matches && matches.length > 0){
				title = matches[1]
							.toLowerCase()
							.replace(/_/g, '-');
			}
			
			results.push(`${fileName}\t\t\t${title}.adoc`);
            
            if(!isTablesComplexDirectoryCreated){
                fs.mkdirSync(path.resolve(__dirname, '../../logs/tables'));
                fs.mkdirSync(path.resolve(__dirname, '../../logs/tables/complex'));
                isTablesComplexDirectoryCreated = true;
            }
            
			fs.writeFileSync(path.resolve(__dirname, `../../logs/tables/complex/${fileName}`), contents, 'utf8');
		}
	});

	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, '../../logs/tables/complex/list.txt'), results.join(os.EOL), 'utf8');
		console.log(`${results.length} crazy tables found`);
	} else {
		console.log('no crazy tables found');
	}

};

var isMiscDirectoryCreated = false;
var miscDirectories = {};
module.specialString = function (folderPath, _specialString) {
	var basePath, fileNames, matches, results = [], title = '';

	basePath = path.resolve(__dirname, folderPath);
	fileNames = fs.readdirSync(basePath);

	fileNames.forEach((fileName) => {
		var filePath, contents;

		filePath = path.join(basePath, fileName);
		contents = fs.readFileSync(filePath, 'utf8');

		if (contents.indexOf(_specialString) > -1) {
			
			matches = contents.match(/name&quot;: &quot;(.*)&/);
			
			if(matches && matches.length > 0){
				title = matches[1]
							.toLowerCase()
							.replace(/_/g, '-');
			}
			
			results.push(`${fileName}\t\t\t${title}.adoc`);
            
            if(!isMiscDirectoryCreated){
                fs.mkdirSync(path.resolve(__dirname, '../../logs/misc'));
                isMiscDirectoryCreated = true;
            }
            
            if(!miscDirectories[_specialString]){
                miscDirectories[_specialString] = true;
                fs.mkdirSync(path.resolve(__dirname, '../../logs/misc/' + _specialString));
            }
            
			fs.writeFileSync(path.resolve(__dirname, `../../logs/misc/${_specialString}/${fileName}`), contents, 'utf8');
		}
	});

	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, `../../logs/misc/${_specialString}/list.txt`), results.join(os.EOL), 'utf8');
		console.log(`${results.length} topics with ${_specialString} found`);
	} else {
		console.log(`no topics with ${_specialString} found`);
	}

};

module.rootLevelTables = function (folderPath) {
	var basePath, fileNames, matches, results = [], title = '', $, $h1;

	basePath = path.resolve(__dirname, folderPath);
	fileNames = fs.readdirSync(basePath);

	fileNames.forEach((fileName) => {
		var filePath, contents;

		filePath = path.join(basePath, fileName);
		contents = fs.readFileSync(filePath, 'utf8');
        
        $ = cheerio.load(contents);
        $h1 = $('h1'); 

		if ($h1 && $h1.next().is('table')) {
			
			matches = contents.match(/name&quot;: &quot;(.*)&/);
			
			if(matches && matches.length > 0){
				title = matches[1]
							.toLowerCase()
							.replace(/_/g, '-');
			}
			
			results.push(`${fileName}\t\t\t${title}.adoc`);
			fs.writeFileSync(path.resolve(__dirname, `../../logs/tables/root-level/${fileName}`), contents, 'utf8');
		}
	});

	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, '../../logs/tables/root-level/list.txt'), results.join(os.EOL), 'utf8');
		console.log(`${results.length} root-level tables found`);
	} else {
		console.log('no root-level tables found');
	}

};

module.longTitles = function (folderPath) {
	var basePath, fileNames, results = [], title = '', $, $h1;

	basePath = path.resolve(__dirname, folderPath);
	fileNames = fs.readdirSync(basePath);

	fileNames.forEach((fileName) => {
		var filePath, contents;

		filePath = path.join(basePath, fileName);
		contents = fs.readFileSync(filePath, 'utf8');
        
        $ = cheerio.load(contents);
        $h1 = $('h1').first(); 
		title = $h1.text();

		if (title.length > 45) {
			results.push(fileName);
		}
	});

	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, '../../logs/long-titles.txt'), results.join(os.EOL), 'utf8');
		console.log(`${results.length} topics found with long titles`);
	} else {
		console.log('no topics found with long titles');
	}

};

var isElementsDirectoryCreated = false;
var isElementsNestedDirectoryCreated = false;
var nestedDirectories = {};

module.nestedElements = function (folderPath, firstElementName, secondElementName) {
	var basePath, fileNames, results = [], matches, title = '';

	basePath = path.resolve(__dirname, folderPath);
	fileNames = fs.readdirSync(basePath);
    
    var folderName = `${firstElementName}-${secondElementName}`;

	fileNames.forEach((fileName) => {
		var filePath, contents, $, nestedElementCount;
		
		if(path.extname(fileName) === '.html'){
			filePath = path.join(basePath, fileName);
			contents = fs.readFileSync(filePath, 'utf8');
			$ = cheerio.load(contents);
			
			$(firstElementName).each((i, element) => {
				var $element = $(element);
				nestedElementCount = $element.find(secondElementName).length;
			});
	
			if (nestedElementCount) {
				matches = contents.match(/name&quot;: &quot;(.*)&/);
				
				if(matches && matches.length > 0){
					title = matches[1]
								.toLowerCase()
								.replace(/_/g, '-');
				}
				
				results.push(`${fileName}\t\t\t${title}.adoc`);
                
                if(!isElementsDirectoryCreated){
                    fs.mkdirSync(path.resolve(__dirname, '../../logs/elements'));
                    isElementsDirectoryCreated = true;
                }
                
                if(!isElementsNestedDirectoryCreated){
                    fs.mkdirSync(path.resolve(__dirname, '../../logs/elements/nested'));
                    isElementsNestedDirectoryCreated = true;
                }
                
                if(!nestedDirectories[folderName]){
                    fs.mkdirSync(path.resolve(__dirname, '../../logs/elements/nested/' + folderName));
                    nestedDirectories[folderName] = true;
                }
                
				fs.writeFileSync(path.resolve(__dirname, `../../logs/elements/nested/${folderName}/${fileName}`), contents, 'utf8');
			}
		}

	});
    
	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, `../../logs/elements/nested/${folderName}/list.txt`), results.join(os.EOL), 'utf8');
		console.log(`${results.length} topics with ${secondElementName}s nested in ${firstElementName}s found`);
	} else {
		console.log(`no topics with ${secondElementName}s nested in ${firstElementName}s found`);
	}
};

module.findBuildFlaggedCode = function (folderPath) {
	var basePath, fileNames, results = [];

	basePath = path.resolve(__dirname, folderPath);
	fileNames = fs.readdirSync(basePath);

	fileNames.forEach((fileName) => {
		var filePath, contents, flaggedBlocks, flaggedCodeCount = 0;

		filePath = path.join(basePath, fileName);
		
		if(path.extname(filePath) === '.adoc'){
			contents = fs.readFileSync(filePath, 'utf8');
			
			flaggedBlocks = contents.split('ifdef');
			
			if(flaggedBlocks.length > 1){
				flaggedBlocks.forEach((block) => {
					if(block.indexOf('[source') > -1){
						flaggedCodeCount++;
					}
				});
				
				if(flaggedCodeCount > 0){
					results.push(fileName);
				}
			}
		}
		
	});

	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, '../../logs/build-flagged-code.txt'), results.join(os.EOL), 'utf8');
		console.log(`${results.length} topics with build flagged code`);
	} else {
		console.log('no topics with build flagged code found');
	}
};

module.hasPattern = (folderPath, pattern, identifier, description) => {
	
	var basePath = path.resolve(__dirname, folderPath);
	var fileNames = fs.readdirSync(basePath);
	
	var badFileNames = [];
	var writePathRoot = '../../logs/patterns';

	fileNames.forEach((fileName) => {
		if(/.adoc/.test(fileName)){
			var text = fs.readFileSync(path.join(basePath, fileName), 'utf8');
			var matches = text.match(pattern)
			if(matches !== null && matches.length > 0){
				badFileNames.push(fileName);
			}
		}
	});
	
	if(badFileNames.length > 0){
		if(!fs.existsSync(writePathRoot)){
			fs.mkdirSync(writePathRoot);
		}
		
		var writeToFolder = path.join(writePathRoot, identifier);
		var reportContents = `${description}${os.EOL}${os.EOL}
------------------${os.EOL}${os.EOL}
${badFileNames.join(os.EOL)}`;
		
		fs.mkdirSync(writeToFolder);
		fs.writeFileSync(path.join(writeToFolder, 'list.txt'), reportContents);
		
		console.log(`${badFileNames.length} topics found for ${identifier}`);
	}
};

var files = fs.readdirSync('../../spec/data/dest');
if(files.length > 100){
    module.getRandomFileNames('../../spec/data/dest', 10, 5, true);
    //module.getRandomFileNames('../../spec/data/dest', 10, 5, false);
}

// run against html-no-format
module.crazyTables('../../spec/data/dest/no-format');

// run against: gulp html
module.nestedElements('../../spec/data/dest/html', 'html', 'html');
module.nestedElements('../../spec/data/dest/html', 'blockquote', 'blockquote');
module.nestedElements('../../spec/data/dest/html', 'blockquote', 'pre');
module.nestedElements('../../spec/data/dest/html', 'blockquote', 'code');

module.specialString('../../spec/data/dest/html', 'wingdings');

module.findBuildFlaggedCode('../../spec/data/dest');
//module.longTitles('../../spec/data/dest/html');

const longListPattern = /(\.{6,} )/g;
module.hasPattern('../../spec/data/dest', longListPattern, 'long-list', 'AsciiDoc does not support lists deeper than five levels deep.');

const spacesInImagePaths = /src=".+(\s).+"/gi;
module.hasPattern('../../spec/data/dest', spacesInImagePaths, 'spaces-in-image-paths', 'Image paths must not have blank spaces');

const operatorCharacterSequences = /(<=|->|<-)/gi;
module.hasPattern('../../spec/data/dest', operatorCharacterSequences, 'operator-character-sequences', 'Operator character sequences (not in code listings) need to be surrounded with double dollar signs. For example: $$=>$$. The characters to look for are <= or -> or <-');

const filePathsWithUnderscores = /\\.*_{1,}.*\\/ig
module.hasPattern('../../spec/data/dest', operatorCharacterSequences, 'paths-with-underscores', 'The file path(s) in these topics need to have all italics removed from the paths so that paths with underscores do not interfere with the AsciiDoc italics (which uses underscores).');

console.log('starting verification');
var verify = require('../verify')
verify.checkFolder('../../spec/data/dest');
/*
*/
console.log('done');