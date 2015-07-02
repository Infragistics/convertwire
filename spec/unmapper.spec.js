/// <reference path="../typings/jasmine/jasmine.d.ts"/>

describe('unmapper', function(){
	
	var unmapper = require('../modules/unmapper.js');
	var fs = require('fs');
	var mappedHTML = '';
	var unmappedHTML = '';
	var path = require('path');
	
	describe('unmap', function(){
		
		beforeEach(function(done){
			if (mappedHTML.length === 0) {
				var fullPath = path.join(__dirname, 'im.html');
				fs.readFile(fullPath, 'utf8', function(readError, data){
					mappedHTML = data;
					unmappedHTML = unmapper.unmap(mappedHTML);
					done();
				});	
			} else {
				done();
			}
		});
		
		it('adds ig-header class', function(){
			expect(unmappedHTML).toContain('class="ig-header"');
		});
		
		it('removes ig-layout', function(){
			expect(unmappedHTML).not.toContain('class="ig-layout"');
		});
		
	});
	
});