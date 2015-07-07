/// <reference path="../../typings/jquery/jquery.d.ts"/>

(function(module){
	
	var cheerio = require('cheerio');
	var $; 
	
	var converters = {
		a: require('../../modules/html2AsciiDoc/element.a.js')
	};
	
	var $root;
	
	var convertChild = function(element){
		var $element = (typeof element.length === 'undefined') ? $(element) : element;
		var kids = [];
		var result = '';
		
		$element.children().each(function(index, child){
			kids.push(convertChild(child));
		});
		
		if($element.is('a')){
			result = converters.a.convert($element);
		}
				
		return result;
	};
	
	module.init = function(htmlString){
		
		if(typeof cheerio !== 'undefined'){
			$ = cheerio.load(htmlString);
		}
		
		$root = $('#docX-root');
		
		convertChild($root);
	};
	
}(module.exports));