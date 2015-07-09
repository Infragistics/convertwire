/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('image converter', function(){
	
	var converter = require('../../modules/html2AsciiDoc/element.img.js');
	var cheerio = require('cheerio');
	
	describe('converter', function(){
		it('converts a well-formed image', function(){
			var $ = cheerio.load('<img src="../images/image.png"/>');
			var $e = $('img');
			var text = converter.convert($e);
			expect(text).toEqual(' image:../images/image.png[] ');
		});
		it('converts a well-formed image with alt', function(){
			var $ = cheerio.load('<img src="../images/image.png" alt="alt tags dance in the moonlight" />');
			var $e = $('img');
			var text = converter.convert($e);
			expect(text).toEqual(' image:../images/image.png[alt tags dance in the moonlight] ');
		});
		xit('supports build flags', function(){
			var $ = cheerio.load('<img src="images/xamDataChart_Creating_Custom_Series_01.png" style="hs-build-flags: SL,WPF,WinPhone">');
			var $e = $('img');
			var text = converter.convert($e);
			expect(text).toEqual('TODO ^^^^ image:images/xamDataChart_Creating_Custom_Series_01.png[]');
		});
	});
});