/// <reference path="../typings/node/node.d.ts"/>
(function(){
	
	var through = require('through2');
	var formatter = require('../modules/sourceFormatter');
	
	module.exports = function(){
		
		var processStream = function(file, encoding, next){
			var xmlString = file.contents.toString(encoding);
			var stream = this;
			var html = formatter.format(xmlString);
			
			file.contents = new Buffer(html, encoding);
			stream.push(file);
			next();
		};
		
		return through.obj(processStream);
	};
	
}());