module = module.exports;

var asciiDocRules = require('./rules-asciidoc.js');
var htmlRules = require('./rules-html.js');

module.asciidoc = function(source){
	asciiDocRules.forEach((rule) => {
		source = source.replace(rule.pattern, rule.replacement);
	});
	return source;
};

module.html = function(source){
	htmlRules.forEach((rule) => {
		source = source.replace(rule.pattern, rule.replacement);
	});
	return source;
};