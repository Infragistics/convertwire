/// <reference path="../typings/node/node.d.ts"/>
(function(){
	
	var through = require('through2');
	var layoutTables = require('../modules/layoutTables');
	var logger = require('../modules/logger');
	
	module.exports = function(){
		
		var processStream = function(file, encoding, next){
			try{
				var markup = file.contents.toString(encoding);
				var stream = this;
				var untabledMarkup = layoutTables.removeLayoutTables(markup);
				file.contents = new Buffer(untabledMarkup, encoding);
				stream.push(file);
			} catch(error){
				logger.log(error);
			}
			next();	
		};
		
		return through.obj(processStream);
	};
	
}());