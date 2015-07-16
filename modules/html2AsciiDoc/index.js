(function(module){
	
	var toMarkdown = require('to-markdown');
	var gfm = require('./asciidoc-converters-gfm.js')
	
	var options = {
		converters: require('./asciidoc-converters.js')
	}
	
	options.converters = options.converters.concat(gfm);
	
	module.convert = function(htmlString){
		return toMarkdown(htmlString, options);
	};
	
}(module.exports));