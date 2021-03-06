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
		
		if(fileName.indexOf('.adoc') === -1){
			return;
		}
		
		if(fileName.indexOf('.ja-JP.adoc') > -1){
			return;
		}
		
		var contents, parts, metadata, name;
		
		contents = fs.readFileSync(path.join(rootPath, fileName), 'utf8');
		parts = contents.split('|metadata|');
		metadata = JSON.parse(parts[1]);
		
		fileName = fileName
					.replace(/.adoc/i, '')
					.replace(/.ja-JP/i, '-ja-JP')
					.replace('.html', '')
					.replace(/\{|\}/g, '');
					
		name = metadata.name.toLowerCase().replace(/_/g, '-');
		
		if(value.documents[fileName] !== undefined){
			value.duplicates[fileName] = name;
		} else {
			value.documents[fileName] = name;
		}
	});
	
	return value;
};