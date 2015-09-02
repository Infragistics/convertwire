var fs = require('fs');
var path = require('path');
var moment = require('moment');
var _ = require('lodash');

var module = module.exports;

module.options = {
	dest: ''
};

module.log = function(message, context, tag, callback){
	
	var filePathPattern, dest;
	
	message = (_.isNull(message) || _.isUndefined(message))? '' : message; 
	context = (_.isNull(context) || _.isUndefined(context))? '' : JSON.stringify(context); 
	tag = (_.isNull(tag) || _.isUndefined(tag))? '' : tag;

	filePathPattern = /(?:[a-zA-Z]\:|\\\\[\w\.]+\\[\w.$]+)\\(?:[\w]+\\)*\w([\w.])+/;
	dest = module.options.dest;
	
	if(!dest.match(filePathPattern)){
		throw new Error('Invalid \'options.dest\' path');
	}
	
	var content = message + ',' + 
				  context + ',' +
				  tag + ',' +
				  moment().format() + '\n';
	
	if(fs.existsSync(dest)){
		fs.appendFile(dest, content, callback);	
	} else {
		fs.writeFile(dest, content, callback);
	}
};