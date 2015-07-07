/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('paragraph converter', function(){
	
	var converter = require('../../modules/html2AsciiDoc/element.p.js');
	var cheerio = require('cheerio');
	
	it('element is p', function(){
		expect(converter.element).toEqual('p');
	});
	
	describe('converter', function(){
		
		it('converts a well-formed paragraph', function(){
			var $ = cheerio.load('<p>This is a test</p>');
			var $e = $('p');
			var text = converter.convert($e);
			expect(text).toEqual('This is a test');
		});
		
		it('converts a paragraph with HTML elements', function(){
			var $ = cheerio.load('<p>This is a <a href="http://www.test.com">test</a></p>');
			var $e = $('p');
			var text = converter.convert($e);
			expect(text).toEqual('This is a test');
		});
	});
});