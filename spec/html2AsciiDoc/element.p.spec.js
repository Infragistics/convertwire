/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('paragraph converter', function(){
	
	var converter = require('../../modules/html2AsciiDoc/element.p.js');
	var cheerio = require('cheerio');
	
	describe('converter', function(){
		it('converts a well-formed paragraph', function(){
			var $ = cheerio.load('<p>This is a test</p>');
			var $e = $('p');
			var text = converter.convert($e, 'This is a test');
			expect(text).toEqual('This is a test');
		});
	});
});