/// <reference path="../typings/node/node.d.ts"/>
var through = require('through2');
var cleanup = require('../modules/cleanup');
var logger = require('../modules/logger');

module.exports = function(){
	
	var processStream = function(file, encoding, next){
		var contents = file.contents.toString(encoding);
		var stream = this;
		file.contents = new Buffer(cleanup.clean(contents), encoding);
		stream.push(file);
		next();
	};
	
	return through.obj(processStream);
};