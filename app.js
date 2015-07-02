// https://www.npmjs.com/package/split
// http://twolfson.com/2014-02-17-suggested-reading-for-writing-a-gulp-plugin


var unmapper = require('./modules/unmapper.js');
var fs = require('fs');
var mappedHTML = '';
var unmappedHTML = '';
var path = require('path');

var fullPath = path.join(__dirname, './spec/im.html');
fs.readFile(fullPath, 'utf8', function(readError, data){
	mappedHTML = data;
	unmappedHTML = unmapper.unmap(mappedHTML);
	console.log(unmappedHTML);
});	