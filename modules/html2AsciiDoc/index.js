/// <reference path="../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>

(function(module){
	
	var cheerio = require('cheerio');
	var $; 
	var _ = require('lodash');
	
	var $root;
	var convertStrategy = require('../../modules/html2AsciiDoc/convertStrategy.js');
	
	var converter = {
		
		processChild : function(element){
			var $element = (_.isUndefined(element.length))? $(element) : element;
			var adocSyntax;
			var result = '';
			
			$element.contents().each(function(index, child){
				result += converter.processChild(child);
			});
			
			adocSyntax = convertStrategy.convert($element, result, $);
			
			return adocSyntax;
		}
	};
	
	module.convert = function(){
		return converter.processChild($root);
	};
	
	module.init = function(htmlString){
		$ = cheerio.load(htmlString);
		
		//$.fn.outerHTML = function(s) {
		//	return (s)? this.before(s).remove() : $('<div>').append(this.eq(0).clone()).html();
		//};
		
		$root = $('#docX-root');
	};
	
}(module.exports));