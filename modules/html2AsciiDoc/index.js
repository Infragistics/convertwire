(function(module){
	
	var toMarkdown = require('to-markdown');
	var converters = [];
	
	var addConverter = function(converter) {
		converters = converters.concat(converter);
	};
	
	var tables = require('./converters-table.js').get();
	var code = require('./converters-code.js').get();
	var igStructure = require('./converters-ig-structure.js').get();
	var structure = require('./converters-structure.js').get();
	var general = require('./converters-general.js').get();
	
	addConverter(code);
	addConverter(tables);
	addConverter(igStructure);
	addConverter(structure);
	addConverter(general);
	
	module.convert = function(htmlString){
		return toMarkdown(htmlString, {converters: converters});
	};
	
}(module.exports));