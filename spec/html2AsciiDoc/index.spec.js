/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('converter', function(){
	
	var converter = require('../../modules/html2AsciiDoc');
	//var cheerio = require('cheerio');
	
	describe('converter', function(){
		it('paragraph with anchor', function(){
			var markup = '<div id="docX-root"><p>This is a test of the <a href="http://www.example.com">emergency broadcast</a> system</p></div>';
			converter.init(markup);
			var asciiDoc = converter.convert();
			expect(asciiDoc).toEqual('This is a test of the link:http://www.example.com[emergency broadcast] system');
		});
	});
});