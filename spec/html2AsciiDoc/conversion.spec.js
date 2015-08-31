/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('html2AsciiDoc', function(){
	
	var converter = require('../../modules/html2AsciiDoc');
	var fs = require('fs');
	var path = require('path')
	
	var getFileContents = function(filePath){
		filePath = path.resolve(__dirname, filePath);
		return fs.readFileSync(filePath, 'utf8');
	};
	
	var getContent = function(fileName){
		var result = {};
		result.html = getFileContents('./html/' + fileName + '.html');
		result.adoc = getFileContents('./asciidoc/' + fileName + '.adoc');
		return result;
	};
	
	var fileNames = [
		'build-list',
		'indented-code',		
		'multiple-ol',		
		'nested-flags',		
		'notes',				
		'table',
		'tables-0E7D',
		'tables-0E8F',		
		'tables-headers',		
		'tables-no-headers',		
		'tables-semantic',		
		'title-anchors',		
		'titles'		
	];
	
	fileNames.forEach(function(fileName){
	//['tables-semantic'].forEach(function(fileName){
		it('converts html into asciidoc: ' + fileName, function(){
			var content = getContent(fileName);
			var result = converter.convert(content.html);
			//fs.writeFileSync(path.resolve(__dirname, './asciidoc/' + fileName + '.adoc'), result);
			expect(result).toEqual(content.adoc);
		});
	});
	
	
	
});