(function(module){
	
	var _ = require('lodash');
	var cheerio = require('cheerio');
	var buildFlags = require('./converters-build-flags.js');
	var whitespace = require('./whitespace.js');

	var cleanTitleAndWhiteSpace = function(content, isHeader){
		var doubleBreak, stripTitleSyntax;
		
		stripTitleSyntax = function(){
			if(_.startsWith(content, '=')){
				var i;
				for(i=0;i<content.length;i++){
					if(content[i] !== '='){
						break;
					}
				}
				content = content.substring(i+1, content.length);
				content = '*' + content.replace('\n', '* +\n');
			}
		};
		
		if(isHeader){
			content = content.replace(/\n/g, '');
			stripTitleSyntax();
		} else{
			doubleBreak = '\n\n';
			
			if(_.startsWith(content, doubleBreak)){
				content = content.replace(/\n\n/, '');
			}
			
			stripTitleSyntax();
			
			if(_.endsWith(content, doubleBreak)){
				content = content.substring(0, content.length - doubleBreak.length);
			}
			
			// remove leftover whitespace link breaks with AsciiDoc link break
			content = content.replace(/(\n){2,}/g, ' \n');
			
			// remove line break character from build flags  
			content = content.replace(/\[\] \+/g, '[]');
			
			content = content.replace(/\<temp-token role=\"list:start\"\>/g, '\n\n'); 
		}
		
		return content;
	};
	
	var createCell = function(content, node, isHeader) {
		var value = '', colspan = '', rowspan = '';
		
		content = cleanTitleAndWhiteSpace(content, isHeader);
		
		colspan = node.getAttribute('colspan');
		colspan = (_.isNull(colspan))? '' : colspan;
		
		rowspan = node.getAttribute('rowspan');
		rowspan = (_.isNull(rowspan))? '' : '.' + rowspan;
		
		if(rowspan.length > 0){
			colspan = _.trimRight(colspan, '+') + rowspan;
		}
		
		value = colspan + '|' + content;
		
		if(!isHeader){
			value = '\n' + value;
		}
		
		if(!_.contains(value, 'ifdef')) {
			value = value.replace(/\|\n/, '|');
		}
		
		return value;
	}
	
	var headerCell = {
		filter: 'th',
	    replacement: function (content, node) {
			return createCell(content, node, true);
	    }
	};
	
	var cell = {
		filter: 'td',
	    replacement: function (content, node) {
			var isHeader = node.parentNode.parentNode.nodeName === 'THEAD';
			return createCell(content, node, isHeader);
	    }
	};
	
	var row = {
		filter: 'tr',
	    replacement: function (content, node) {
			var value = content;
			
			if(buildFlags.hasDocXBuildFlags(node)){
				value = buildFlags.wrapWithBuildFlags(value, node);
			}
			 
			return '\n' + value + '\n\n\n';
	    }
	};
	
	var table = {
		filter: 'table',
	    replacement: function (content, node) {
			var headerOption = '', value, columnFormats, $, firstRow, columns, columnCount;
			
			var hasHeaders = function(content){
				var value, quarterPosition, lines;
				
				value = false;
				quarterPosition = content.length / 4;
				lines = content.substring(0, quarterPosition).split('\n');
				value = lines[0].lastIndexOf('|') > 0;
				
				return value;
			};
			
			content = whitespace.removeExtraLineBreaks(content);
			
			$ = cheerio.load(node.outerHTML);
			firstRow = $('tr').first();
			columns = firstRow.find('td,th');
			columnCount = columns.length;
			
			if(columnCount > 0){
				columnFormats = Array(columnCount + 1).join('a,');
				columnFormats = columnFormats.substr(0, columnFormats.length-1);
			}
			
			if(hasHeaders(content)){
				headerOption = `[options="header", cols="${columnFormats}"]\n`
			} else if(columnCount > 0){
				headerOption = `[cols="${columnFormats}"]\n`
			}
			
			if(!_.startsWith(content, '\n')){
				content = '\n' + content;
			}
			
			value = '\n\n' + headerOption + '|====' + content + '|====\n\n';
			
			if(buildFlags.hasDocXBuildFlags(node)){
				value = buildFlags.wrapWithBuildFlags(value, node);
			} 
			
	      	return value;
	    }
	};
	
	var bodyHeaderFooter = {
		filter: ['thead', 'tbody', 'tfoot'],
	    replacement: function (content) {
	      return content;
	    }
	};
	
	var converters = [];
	
	converters.push(headerCell);
	converters.push(cell);
	converters.push(row);
	converters.push(table);
	converters.push(bodyHeaderFooter);
	
	module.get = function(){
		return converters;
	};	
	
}(module.exports));