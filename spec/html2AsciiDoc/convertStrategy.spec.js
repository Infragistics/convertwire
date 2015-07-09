/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('convertStrategy', function(){
	
	var converter = require('../../modules/html2AsciiDoc/convertStrategy.js');
	var cheerio = require('cheerio');
	
	describe('convert', function(){
		it('will convert anchor', function(){
			var $ = cheerio.load('<a href="http://www.example.com">Test</a>');
			var $e = $('a');
			var result = converter.convert($e, 'Test', $);
			expect(result).toEqual('link:http://www.example.com[Test]');
		});
	});
});