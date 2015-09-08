/// <reference path="../typings/node/node.d.ts"/>
(function(){
	
	var through = require('through2');
	var parser = require('../modules/docXParser');
	var logger = require('../modules/logger');
	
	module.exports = function(){
		
		var processStream = function(file, encoding, next){
			var xmlString = file.contents.toString(encoding);
			var stream = this;
			parser.parse(xmlString, file.path, function(error, topic){
				if(error){
					logger.log(error);
				} else {
					file.contents = new Buffer(parser.toHtml(topic), encoding);
					stream.push(file);
				}
				next();	
			});
		};
		
		return through.obj(processStream);
	};
	
}());