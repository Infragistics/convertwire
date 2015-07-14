// https://www.npmjs.com/package/split
// http://twolfson.com/2014-02-17-suggested-reading-for-writing-a-gulp-plugin

var converter = require('./modules/html2AsciiDoc');
var markup = '<div id="docX-root"><p>This is a <em>test</em> of the <a href="http://www.example.com"><strong>emergency</strong> broadcast</a> system</p></div>';
//var markup = '<div id="docX-root"><ul><li>1<ul><li>1.1</li></ul>1.a</li><li>2</li></ul></div>';
var asciiDoc = converter.convert(markup);
console.log(asciiDoc);