/// <reference path="../typings/node/node.d.ts"/>
(function(){
	
	var through = require('through2');
	var converter = require('../modules/html2AsciiDoc');
	var logger = require('../modules/logger');
	
	module.exports = function(options){
		
		var processStream = function(file, encoding, next){
			try {
				var html = file.contents.toString(encoding);
				var stream = this;
				var asciidoc = converter.convert(html, options);
				file.contents = new Buffer(asciidoc, encoding);
				stream.push(file);
			} catch(error){
				logger.log(error);
			}
			next();	
		};
		
		return through.obj(processStream);
	};
	
}());