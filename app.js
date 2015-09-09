/// <reference path="typings/node/node.d.ts"/>

/* asciidoc file converstion
var converter = require('./modules/html2AsciiDoc');
var fs = require('fs');
var path = require('path');
var fullPath = path.join(__dirname, './spec/html2AsciiDoc/html/tables-colspan.html');

fs.readFile(fullPath, 'utf8', function(error, content){
	var html = content;
	var asciiDoc = converter.convert(html);
	console.log(asciiDoc);	
}); 
// */

/* parser
var parser = require('./modules/docXParser');
var unmapper = require('./modules/unmapper');
var fs = require('fs');
var path = require('path');
var fullPath = path.join(__dirname, './spec/data/src/4fb63863-ed39-497c-a8eb-9cb0b17e16cd.xml');

fs.readFile(fullPath, 'utf8', function(error, xml){
	parser.parse(xml, fullPath, function(err, document){
		if(err) {
			console.log(err)
		}
		
		if(document){
			var html = parser.toHtml(document);
			var unmappedMarkup = unmapper.unmap(html);
			console.log(unmappedMarkup);
		}
	});	
}); 
// */

/* logger
var logger = require('./modules/logger');
var fs = require('fs');

var dest = logger.options.dest = __dirname + '\\spec\\logger.csv';
//var dest = logger.options.dest = './spec/temp/logger.csv';	
			
if(fs.existsSync(dest)){
	fs.unlinkSync(dest);
}

logger.log('test', null, null, function(err){
	debugger;
	var contents = fs.readFileSync(dest, {encoding: 'utf8'});
	console.log(contents);
});

// */

//* unmapper
//4fb63863-ed39-497c-a8eb-9cb0b17e16cd
var parser = require('./modules/docXParser');
var unmapper = require('./modules/unmapper');
var fs = require('fs');
var path = require('path');
var fullPath = path.join(__dirname, './spec/data/src/4fb63863-ed39-497c-a8eb-9cb0b17e16cd.xml');

fs.readFile(fullPath, 'utf8', function(error, xml){
	parser.parse(xml, fullPath, function(err, document){
		if(err) {
			console.log(err)
		}
		
		if(document){
			var html = parser.toHtml(document);
			var unmappedMarkup = unmapper.unmap(html);
			console.log(unmappedMarkup);
		}
	});	
}); 
//*/