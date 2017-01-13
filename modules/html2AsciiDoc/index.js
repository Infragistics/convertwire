(function(module){
	
	var toMarkdown = require('to-markdown');
	var converters = [];
	
	var addConverter = function(converter) {
		converters = converters.concat(converter);
	};
	
	module.convert = function(htmlString, options){

		if(!options) {
			options = {
				allowH1Headers: false
			};
		}

		var tables = require('./converters-table.js').get();
		var code = require('./converters-code.js').get();
		var igStructure = require('./converters-ig-structure.js').get();
		var structure = require('./converters-structure.js').get(options);
		var general = require('./converters-general.js').get();

		addConverter(code);
		addConverter(tables);
		addConverter(igStructure);
		addConverter(structure);
		addConverter(general);

		return toMarkdown(htmlString, {converters: converters});
	};
	
}(module.exports));