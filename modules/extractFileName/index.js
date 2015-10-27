module = module.exports;

var fs = require('fs');
var path = require('path');

module.read = function(relativePath){
	
	var rootPath = path.resolve(__dirname, relativePath);
	
	var files = fs.readdirSync(rootPath);
			
	var value = {
		documents: {},
		duplicates: {}
	};
	
	files.forEach(function(fileName){
		var contents, parts, metadata;
		
		contents = fs.readFileSync(path.join(rootPath, fileName), 'utf8');
		parts = contents.split('|metadata|');
		metadata = JSON.parse(parts[1]);
		
		fileName = fileName
					.replace(/.adoc/i, '')
					.replace(/.ja-JP/i, '-ja-JP');
		
		if(value.documents[fileName] !== undefined){
			value.duplicates[fileName] = metadata.name;
		} else {
			value.documents[fileName] = metadata.name;
		}
	});
	
	return value;
};