module = module.exports;

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
		randoms.push('\n');
	}
	
	var nameSuffix = english? '' : '-ja-JP';

	fs.writeFileSync(path.resolve(__dirname, `../../logs/randomNames${nameSuffix}.txt`), randoms.join('\n'), 'utf8');
	
	console.log('names generated');
};
//module.getRandomFileNames('../../spec/data/dest', 10, 5, false);

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

// run against html-no-format
module.crazyTables('../../spec/data/dest/no-format');

module.nestedTables = function (folderPath) {
	var basePath, fileNames, results = [], matches, title = '';

	basePath = path.resolve(__dirname, folderPath);
	fileNames = fs.readdirSync(basePath);

	fileNames.forEach((fileName) => {
		var filePath, contents, $, nestedTableCount;
		
		if(path.extname(fileName) === '.html'){
			filePath = path.join(basePath, fileName);
			contents = fs.readFileSync(filePath, 'utf8');
			$ = cheerio.load(contents);
			
			$('table').each((i, table) => {
				var $table = $('table');
				nestedTableCount = $table.find('table').length;
			});
	
			if (nestedTableCount) {
				matches = contents.match(/name&quot;: &quot;(.*)&/);
				
				if(matches && matches.length > 0){
					title = matches[1]
								.toLowerCase()
								.replace(/_/g, '-');
				}
				
				results.push(`${fileName}\t\t\t${title}.adoc`);
				fs.writeFileSync(path.resolve(__dirname, `../../logs/tables/nested/${fileName}`), contents, 'utf8');
			}
		}

	});

	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, '../../logs/tables/nested/list.txt'), results.join('\n'), 'utf8');
		console.log(`${results.length} nested tables found`);
	} else {
		console.log('no nested tables found');
	}

};

// run against: gulp html
module.nestedTables('../../spec/data/dest/html');

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

module.findBuildFlaggedCode('../../spec/data/dest');