/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('paragraph converter', function(){
	
	var converter = require('../../modules/html2AsciiDoc/element.headers.js');
	var cheerio = require('cheerio');
	
	describe('converter', function(){
		
		it('preserves id values', function(){
			var $ = cheerio.load('<h1 id="holy-guacamole">This is a test</h1>');
			var $e = $('h1');
			var text = converter.convert($e, 'This is a test');
			expect(text).toEqual('[[holy-guacamole]]\n= This is a test\n');
		});
		
		it('converts h1', function(){
			var $ = cheerio.load('<h1>This is a test</h1>');
			var $e = $('h1');
			var text = converter.convert($e, 'This is a test');
			expect(text).toEqual('= This is a test\n');
		});
		
		it('converts h2', function(){
			var $ = cheerio.load('<h2>This is a test</h2>');
			var $e = $('h2');
			var text = converter.convert($e, 'This is a test');
			expect(text).toEqual('== This is a test\n');
		});
		
		it('converts h3', function(){
			var $ = cheerio.load('<h3>This is a test</h3>');
			var $e = $('h3');
			var text = converter.convert($e, 'This is a test');
			expect(text).toEqual('=== This is a test\n');
		});
		
		it('converts h4', function(){
			var $ = cheerio.load('<h4>This is a test</h4>');
			var $e = $('h4');
			var text = converter.convert($e, 'This is a test');
			expect(text).toEqual('==== This is a test\n');
		});
		
		it('converts h5', function(){
			var $ = cheerio.load('<h5>This is a test</h5>');
			var $e = $('h5');
			var text = converter.convert($e, 'This is a test');
			expect(text).toEqual('===== This is a test\n');
		});
		
		it('converts h6', function(){
			var $ = cheerio.load('<h6>This is a test</h6>');
			var $e = $('h6');
			var text = converter.convert($e, 'This is a test');
			expect(text).toEqual('====== This is a test\n');
		});
	});
});