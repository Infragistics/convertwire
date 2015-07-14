(function(module){
	
	var toMarkdown = require('to-markdown');
	
	var options = {
		converters: require('./asciidoc-converters.js'),
		gfm: true
	}
	
	module.convert = function(htmlString){
		return toMarkdown(htmlString, options);
	};
	
}(module.exports));