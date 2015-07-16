/// <reference path="../typings/node/node.d.ts"/>
(function(){
	
	var through = require('through2');
	var converter = require('../modules/html2AsciiDoc');
	
	module.exports = function(){
		
		var processStream = function(file, encoding, next){
			var html = file.contents.toString(encoding);
			var stream = this;
			var asciidoc = converter.convert(html);
			file.contents = new Buffer(asciidoc, encoding);
			stream.push(file);
			next();	
		};
		
		return through.obj(processStream);
	};
	
}());