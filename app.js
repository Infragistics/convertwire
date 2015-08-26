/// <reference path="typings/node/node.d.ts"/>
// https://www.npmjs.com/package/split
// http://twolfson.com/2014-02-17-suggested-reading-for-writing-a-gulp-plugin

var converter = require('./modules/html2AsciiDoc');
var parser = require('./modules/docXParser');

//* asciidoc file converstion
var fs = require('fs');
var path = require('path');
var fullPath = path.join(__dirname, './spec/data/src/html/tables-0E8F.html');

fs.readFile(fullPath, 'utf8', function(error, content){
	var html = content;
	//console.log(html);
	
	console.log('');
	console.log('--------------------------');
	console.log('');
	
	var asciiDoc = converter.convert(html);
	console.log(asciiDoc);	
}); 
// */

/* parser
var fs = require('fs');
var path = require('path');
var fullPath = path.join(__dirname, './spec/data/src/{0A350874-93D1-4735-AF7B-D07F48E85A2F}.ja-JP.xml');

fs.readFile(fullPath, 'utf8', function(error, xml){
	parser.parse(xml, function(err, html){
		if(err) console.log(err);
		
		console.log(html);
	});	
}); 
// */