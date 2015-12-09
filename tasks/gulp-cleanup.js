/// <reference path="../typings/node/node.d.ts"/>
var through = require('through2');
var cleanup = require('../modules/cleanup');
var logger = require('../modules/logger');

module.exports = function(sourceType, name){
	
	var processStream = function(file, encoding, next){
		var contents = file.contents.toString(encoding);
		var stream = this;
		file.contents = new Buffer(cleanup[sourceType](contents, name), encoding);
		stream.push(file);
		next();
	};
	
	return through.obj(processStream);
};