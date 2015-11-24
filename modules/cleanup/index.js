module = module.exports;

var asciiDocRules = require('./rules-asciidoc.js');
var htmlRules = require('./rules-html.js');
var cheerio = require('cheerio');

module.asciidoc = function(source){
	asciiDocRules.regex.forEach((rule) => {
		source = source.replace(rule.pattern, rule.replacement);
	});
	return source;
};

module.html = function(source){
	var $ = cheerio.load(source);
	var replacements = [];
	
	htmlRules.jquery.forEach((rule) => {
		replacements = replacements.concat(rule.apply($));
	});
	
	replacements.forEach((rule) => {
		var regex = new RegExp(rule.src, 'gi');
		source = source.replace(regex, rule.dest);
	});
	
	htmlRules.regex.forEach((rule) => {
		source = source.replace(rule.pattern, rule.replacement);
	});
	return source;
};