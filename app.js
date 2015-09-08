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

//* parser
var parser = require('./modules/docXParser');
var fs = require('fs');
var path = require('path');
var fullPath = path.join(__dirname, './spec/data/src/bad-file.xml');

fs.readFile(fullPath, 'utf8', function(error, xml){
	parser.parse(xml, fullPath, function(err, document){
		if(err) {
			console.log(err)
		}
		
		if(document){
			var html = parser.toHtml(document);
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