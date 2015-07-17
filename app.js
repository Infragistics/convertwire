// https://www.npmjs.com/package/split
// http://twolfson.com/2014-02-17-suggested-reading-for-writing-a-gulp-plugin

var converter = require('./modules/html2AsciiDoc');
var parser = require('./modules/docXParser');

//var markup = '<div id="docX-root"><p>This is a <em>test</em> of the <a href="http://www.example.com"><strong>emergency</strong> broadcast</a> system</p></div>';
//var markup = '<div id="docX-root"><ul><li>1<ul><li>1.1</li></ul>1.a</li><li>2</li></ul></div>';
//var markup = '<table><thead><tr><th>Heading1</th></tr></thead><tbody><tr><td>cell1</td></tr></tbody></table>';
//var asciiDoc = converter.convert(markup);
//console.log(asciiDoc);

/* asciidoc converstion
var fs = require('fs');
var path = require('path');
//var fullPath = path.join(__dirname, './spec/data/dest/0C71AEB5-1D6C-4BFF-BA3B-78D7C17D5839.html');
var fullPath = path.join(__dirname, './spec/data/dest/0A2D258E-B3A1-4FD4-B900-F119D40035B6.html');

fs.readFile(fullPath, 'utf8', function(error, content){
	var html = content;
	var asciiDoc = converter.convert(html);
	console.log(asciiDoc);	
}); 
// */

//* parser
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