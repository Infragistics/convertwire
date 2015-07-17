/// <reference path="../typings/node/node.d.ts"/>
(function(){
	
	var through = require('through2');
	var parser = require('../modules/docXParser');
	
	module.exports = function(){
		
		var processStream = function(file, encoding, next){
			var xmlString = file.contents.toString(encoding);
			var stream = this;
			parser.parse(xmlString, function(error, topic){
				file.contents = new Buffer(parser.toHtml(topic), encoding);
				stream.push(file);
				next();	
			});
		};
		
		return through.obj(processStream);
	};
	
}());