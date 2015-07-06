/// <reference path="../typings/jasmine/jasmine.d.ts"/>

describe('parser', function(){
	
	var parser = require('../modules/parser.js');
	var fs = require('fs');
	var htmlString = '';
	var path = require('path');
	
	beforeEach(function(done){
		if(htmlString.length === 0){
			var fullPath = path.join(__dirname, 'parser.html');
			fs.readFile(fullPath, 'utf8', function(error, contents){
				htmlString = contents;
				done();
			});
		} else {
			done();
		}
	});
	
	it('works', function(){
		parser.init(htmlString);
	});
});