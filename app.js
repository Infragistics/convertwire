// https://www.npmjs.com/package/split
// http://twolfson.com/2014-02-17-suggested-reading-for-writing-a-gulp-plugin

//var markup = '<div id="docX-root"><p>This is a <em>test</em> of the <a href="http://www.example.com"><strong>emergency</strong> broadcast</a> system</p></div>';
//var markup = '<div id="docX-root"><ul><li>1<ul><li>1.1</li></ul>1.a</li><li>2</li></ul></div>';
//var markup = '<table><thead><tr><th>Heading1</th></tr></thead><tbody><tr><td>cell1</td></tr></tbody></table>';
//var asciiDoc = converter.convert(markup);
//console.log(asciiDoc);

var fs = require('fs');
var path = require('path');
var fullPath = path.join(__dirname, './spec/data/done/0e363f90-9f23-46d4-86db-151915650724.html');
var converter = require('./modules/html2AsciiDoc');

fs.readFile(fullPath, 'utf8', function(error, content){
	var html = content;
	var asciiDoc = converter.convert(html);
	console.log(asciiDoc);	
}); 