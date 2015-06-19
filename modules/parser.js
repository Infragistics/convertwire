/// <reference path="../typings/node/node.d.ts"/>

(function (module) {
	
	'use strict';
	
	var fs = require('fs');
	var path = require('path');
	var xml2js = require('xml2js');
	var parser = new xml2js.Parser({
		explicitArray: false
	});
	
	module.read = function(relativePath, callback){
		var fullPath = path.join(__dirname, relativePath);
		fs.exists(fullPath, function(exists){
			if(exists){
				fs.readFile(fullPath, callback);
			} else {
				var error = new Error(fullPath + ' does not exist');
				callback(error, null);
			}
		});
	};
	
	module.parse = function(xmlString, callback) {
		parser.parseString(xmlString, callback);
	};
	
	module.parseFile = function(relativePath, callback){
		module.read(relativePath, function(error, content){
			if(error){
				callback(error, null);
			} else {
				module.parse(content, callback);
			}
		});
	};
	
}(module.exports));