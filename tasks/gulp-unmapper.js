/// <reference path="../typings/node/node.d.ts"/>
(function(){
	
	var through = require('through2');
	var unmapper = require('../modules/unmapper');
	var logger = require('../modules/logger');
	
	module.exports = function(){
		
		var processStream = function(file, encoding, next){
			try{
				var mappedMarkup = file.contents.toString(encoding);
				var stream = this;
				var unmappedMarkup = unmapper.unmap(mappedMarkup);
				file.contents = new Buffer(unmappedMarkup, encoding);
				stream.push(file);
			} catch(error){
				logger.log(error);
			}
			next();	
		};
		
		return through.obj(processStream);
	};
	
}());