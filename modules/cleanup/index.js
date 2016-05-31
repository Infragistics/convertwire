module = module.exports;

var asciiDocRules = require('./rules-asciidoc.js');
var htmlRules = require('./rules-html.js');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
var localRules;

module.asciidoc = function(source, name){
	var rules = [];
	
	rules = rules.concat(asciiDocRules.regex);
	
	if(name){
		var localRulesPath = path.resolve(__dirname, './rules-asciidoc-' + name.toLowerCase() + '.js'); 
		if(fs.existsSync(localRulesPath)){
			localRules = require(localRulesPath);
			if(localRules.regex){
				rules = rules.concat(localRules.regex);
			}
		}
	}
	
	rules.forEach((rule) => {
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
		var expression = rule.src;
		
		expression = expression.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
							   
        var regex = new RegExp(expression, 'gi');
		source = source.replace(regex, rule.dest);
	});
	
	htmlRules.regex.forEach((rule) => {
		source = source.replace(rule.pattern, rule.replacement);
	});
	return source;
};