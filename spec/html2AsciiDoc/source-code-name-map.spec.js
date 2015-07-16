/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('source code name map', function(){
	
	var mapper = require('../../modules/html2AsciiDoc/source-code-name-map.js');
	
	describe('map', function(){
		
		it('cs returns csharp', function(){
			var result = mapper.map('cs');
			expect(result).toEqual('csharp');
		});
		
		it('vb returns vb', function(){
			var result = mapper.map('vb');
			expect(result).toEqual('vb');
		});
		
	});
	
});