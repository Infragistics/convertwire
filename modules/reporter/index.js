module = module.exports;

var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');

fs.mkdirSync(path.resolve(__dirname, '../../logs/misc'));
fs.mkdirSync(path.resolve(__dirname, '../../logs/misc/wingdings'));

fs.mkdirSync(path.resolve(__dirname, '../../logs/tables'));
fs.mkdirSync(path.resolve(__dirname, '../../logs/tables/complex'));
fs.mkdirSync(path.resolve(__dirname, '../../logs/tables/root-level'));
fs.mkdirSync(path.resolve(__dirname, '../../logs/tables/nested'));
fs.mkdirSync(path.resolve(__dirname, '../../logs/tables/nested/blockquote-blockquote'));
fs.mkdirSync(path.resolve(__dirname, '../../logs/tables/nested/blockquote-pre'));
fs.mkdirSync(path.resolve(__dirname, '../../logs/tables/nested/blockquote-code'));

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
		randoms.push('\n');
	}
	
	var nameSuffix = english? '' : '-ja-JP';

	fs.writeFileSync(path.resolve(__dirname, `../../logs/randomNames${nameSuffix}.txt`), randoms.join('\n'), 'utf8');
	
	console.log('names generated');
};

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
			fs.writeFileSync(path.resolve(__dirname, `../../logs/tables/complex/${fileName}`), contents, 'utf8');
		}
	});

	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, '../../logs/tables/complex/list.txt'), results.join('\n'), 'utf8');
		console.log(`${results.length} crazy tables found`);
	} else {
		console.log('no crazy tables found');
	}

};

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
			fs.writeFileSync(path.resolve(__dirname, `../../logs/misc/${_specialString}/${fileName}`), contents, 'utf8');
		}
	});

	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, `../../logs/misc/${_specialString}/list.txt`), results.join('\n'), 'utf8');
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
		fs.writeFileSync(path.resolve(__dirname, '../../logs/tables/root-level/list.txt'), results.join('\n'), 'utf8');
		console.log(`${results.length} root-level tables found`);
	} else {
		console.log('no root-level tables found');
	}

};

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
				fs.writeFileSync(path.resolve(__dirname, `../../logs/tables/nested/${folderName}/${fileName}`), contents, 'utf8');
			}
		}

	});
    
	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, `../../logs/tables/nested/${folderName}/list.txt`), results.join('\n'), 'utf8');
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
		fs.writeFileSync(path.resolve(__dirname, '../../logs/build-flagged-code.txt'), results.join('\n'), 'utf8');
		console.log(`${results.length} topics with build flagged code`);
	} else {
		console.log('no topics with build flagged code found');
	}
};

var files = fs.readdirSync('../../spec/data/dest');
if(files.length > 100){
    module.getRandomFileNames('../../spec/data/dest', 10, 5, true);
    module.getRandomFileNames('../../spec/data/dest', 10, 5, false);
}


// run against html-no-format
module.crazyTables('../../spec/data/dest/no-format');

// run against: gulp html
module.nestedElements('../../spec/data/dest/html', 'html', 'html');
module.nestedElements('../../spec/data/dest/html', 'blockquote', 'blockquote');
module.nestedElements('../../spec/data/dest/html', 'blockquote', 'pre');
module.nestedElements('../../spec/data/dest/html', 'blockquote', 'code');

module.rootLevelTables('../../spec/data/dest/html');

module.specialString('../../spec/data/dest/html', 'wingdings');

module.findBuildFlaggedCode('../../spec/data/dest');

var verify = require('../verify')
verify.checkFolder('../../spec/data/dest');