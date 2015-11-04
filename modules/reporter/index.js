module = module.exports;

var _ = require('lodash');
var path = require('path');
var fs = require('fs');

module.getRandomFileNames = (folderPath, count, groupCount) => {
	var randoms, basePath, fileNames, fileCount, index;

	randoms = [];

	basePath = path.resolve(__dirname, folderPath);
	fileNames = fs.readdirSync(basePath);
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

	fs.writeFileSync(path.resolve(__dirname, '../../logs/randomNames.txt'), randoms.join('\n'), 'utf8');
};
//module.getRandomFileNames('../../spec/data/dest', 10, 5);

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
			
			if(matches.length > 0){
				title = matches[1]
							.toLowerCase()
							.replace(/_/g, '-');
			}
			
			results.push(`${fileName}\t\t\t${title}.adoc`);
			fs.writeFileSync(path.resolve(__dirname, `../../logs/tables/${fileName}`), contents, 'utf8');
		}
	});

	if (results.length > 0) {
		fs.writeFileSync(path.resolve(__dirname, '../../logs/tables/tables.txt'), results.join('\n'), 'utf8');
		console.log(`${results.length} crazy tables found`);
	} else {
		console.log('no crazy tables found');
	}

};

module.crazyTables('../../spec/data/dest');