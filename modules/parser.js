/* global cheerio */
/// <reference path="../typings/jquery/jquery.d.ts"/>

(function(module){
	
	/*
	var cheerio = require('cheerio');
	var $; 
	// */
	
	var $root;
	
	var convertChild = function(element){
		var $element = (typeof element.length === 'undefined') ? $(element) : element;
		var kids = [];
		$element.children().each(function(index, child){
			kids.push(convertChild(child));
		});
		
		if($element.is('a')){
			console.log($element.text());
		}
		
		return $element.text();
	};
	
	module.init = function(htmlString){
		
		if(typeof cheerio !== 'undefined'){
			$ = cheerio.load(htmlString);
		}
		
		$root = $('#docX-root');
		
		var result = convertChild($root);
		console.log(result.length);
	};
	
}(module.exports));