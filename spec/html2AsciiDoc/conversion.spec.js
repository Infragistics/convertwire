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
	
	[
		'anchors',
		'anchor-target-spaces',
		'anchors-title',
		'code-listing-nested-structure',
		'build-list',
		'indented-code',
		'div',		
		'multiple-ol',		
		'nested-flags',		
		'notes',				
		'notes-ja',				
		'table',
		'table-p',
		'table-code',
		'table-note',
        'heading-link',
        'header-blank',
		'ig-bold',
		'tables-0E7D',
		'tables-0E8F',		
		'tables-headers',		
		'tables-no-headers',		
		'tables-semantic',		
		'title-anchors',
		'table-empty-cell-ignores-case',
		'table-widget',		
		'table-link-jp-text',		
		'titles',
        'title-anchor-internal',
        'title-anchor-at-end',
		'list-item-nested',
		'list-item-nested-with-item-text',
		'list-unordered',
		'ig-code-in-text',
        'paragraph-bold-start',
		'pick-macro-new-line-space',
		'code-in-table',
		'list-bad-nesting',
		'table-cell-extra-space-link',
		'innovasys-widget-include',
		'ig-level',
		'unmapper-row-build-flags',
		'unformatted-content-after-title'
	].forEach(function(fileName){
		it('converts html into asciidoc: ' + fileName, function(){
			var content = getContent(fileName);
			var result = converter.convert(content.html);
			//fs.writeFileSync(path.resolve(__dirname, './asciidoc/' + fileName + '.adoc'), result);
			expect(result).toEqual(content.adoc);
		});
	});
	
	[
		'tables-colspan',		
		'tables-rowspan',
	].forEach(function(fileName){
		it('converts html into asciidoc: ' + fileName, function(){
			var content = getContent(fileName);
			var result = converter.convert(content.html);
			expect(result).toMatch(content.adoc);
		});
	});
	
	
	
	
	
});