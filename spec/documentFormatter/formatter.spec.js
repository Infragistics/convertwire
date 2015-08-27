/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('sourceFormatter', function(){
	
	var formatter = require('../../modules/sourceFormatter');
	
	it('returns an instance', function(){
		expect(formatter).not.toBeNull();
	});
	
	describe('format', function(){
		
		var html = '<pre style="hs-build-flags: SL,WPF,WinPhone">code</pre>';
		
		it('returns a value', function(){
			var newHtml = formatter.format(html);	
			expect(newHtml).toBeDefined();
		});
		
		it('returns a value', function(){
			var newHtml = formatter.format(html);	
			expect(newHtml).toBeDefined();
		});
		
	});
	
});