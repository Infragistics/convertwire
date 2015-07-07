/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('anchor converter', function(){
	
	var converter = require('../../modules/html2AsciiDoc/element.a.js');
	var cheerio = require('cheerio');
	
	it('element is a', function(){
		expect(converter.element).toEqual('a');
	});
	
	describe('converter', function(){
		
		it('converts a well-formed anchor', function(){
			var $ = cheerio.load('<a href="http://www.test.com">Test</a>');
			var $e = $('a');
			var text = converter.convert($e);
			expect(text).toEqual('link:http://www.test.com[Test]');
		});
		
		it('returns text only for anchors with no href', function(){
			var $ = cheerio.load('<a>Test</a>');
			var $e = $('a');
			var text = converter.convert($e);
			expect(text).toEqual('Test');
		});
		
		it('returns an empty string for anchors with no text', function(){
			var $ = cheerio.load('<a href="http://www.test.com"></a>');
			var $e = $('a');
			var text = converter.convert($e);
			expect(text).toEqual('');
		});
		
	});
	
	
});