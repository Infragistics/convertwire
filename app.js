/// <reference path="typings/node/node.d.ts"/>

//* asciidoc file converstion
var converter = require('./modules/html2AsciiDoc');
var fs = require('fs');
var path = require('path');
var fullPath = path.join(__dirname, './spec/data/dest/0E8FC032-A48B-432B-A077-B528AB69C964.html');

fs.readFile(fullPath, 'utf8', function(error, content){
	var html = content;
	var asciiDoc = converter.convert(html);
	console.log(asciiDoc);	
}); 
// */

/* parser
var parser = require('./modules/docXParser');
var fs = require('fs');
var path = require('path');
var fullPath = path.join(__dirname, './spec/data/src/189b488d-7833-4379-bc1f-0770ff6a6844.xml');

fs.readFile(fullPath, 'utf8', function(error, xml){
	parser.parse(xml, function(err, document){
		if(err) console.log(err);
		var html = parser.toHtml(document);
		console.log(html.indexOf('&#xA0;'));
	});	
}); 
// */