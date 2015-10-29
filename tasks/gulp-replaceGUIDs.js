var through = require('through2');
var replaceGUIDs = require('../modules/replaceGUIDs');
var logger = require('../modules/logger');

module.exports = function(remoteData){
	
	var processStream = function(file, encoding, next){
		try{
			var content = file.contents.toString(encoding);
			var stream = this;
			var replacedContent = replaceGUIDs.replace(content, remoteData);
			file.contents = new Buffer(replacedContent, encoding);
			stream.push(file);
		} catch(error){
			logger.log(error);
		}
		next();	
	};
	
	return through.obj(processStream);
};