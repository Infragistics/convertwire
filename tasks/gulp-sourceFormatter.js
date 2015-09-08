/// <reference path="../typings/node/node.d.ts"/>
(function(){
	
	var through = require('through2');
	var formatter = require('../modules/sourceFormatter');
	var logger = require('../modules/logger');
	
	module.exports = function(){
		
		var processStream = function(file, encoding, next){
			try{
				var xmlString = file.contents.toString(encoding);
				var stream = this;
				var html = formatter.format(xmlString);
				
				file.contents = new Buffer(html, encoding);
				stream.push(file);
			} catch(error){
				logger.log(error);
			}
			next();
		};
		
		return through.obj(processStream);
	};
	
}());