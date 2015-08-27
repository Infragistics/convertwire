(function(module){
	
	var _ = require('lodash');
	var buildFlags = require('./converters-build-flags.js');

	var cleanTitleAndWhiteSpace = function(content){
		var doubleBreak;

		doubleBreak = '\n\n';
		
		if(_.startsWith(content, doubleBreak)){
			content = content.replace(/\n\n/, '');
		}
		
		var stripTitleSyntax = function(){
			if(_.startsWith(content, '=')){
				var i;
				for(i=0;i<content.length;i++){
					if(content[i] !== '='){
						break;
					}
				}
				content = content.substring(i+1, content.length);
			}
		};
		
		stripTitleSyntax();
		
		if(_.endsWith(content, doubleBreak)){
			content = content.substring(0, content.length - doubleBreak.length);
		}
		
		content = content.replace(/\n\n\n\n/g, ' + \n');
		
		return content;
	};
	
	var createCell = function(content, node, isHeader) {
		var value = '';
		
		content = cleanTitleAndWhiteSpace(content);
		
		if(isHeader){
			value = '|' + content;
		} else {
			value = '\n|' + content;
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
			return '\n\n' + content + '\n\n';
	    }
	};
	
	var table = {
		filter: 'table',
	    replacement: function (content, node) {
			var headerOption = '', value;
			
			// deal with headers
			debugger;
			
			var hasHeaders = function(content){
				var value = false;
				
				var quarterPosition = content.length / 4;
				
				var lines = content.substring(0, quarterPosition).split('\n');
				
				value = lines[1].lastIndexOf('|') > 0;
				
				return value;
			};
			
			
			content = content.replace(/\n/, '');
			
			if(hasHeaders(content)){
				headerOption = '[options="header"]\n'
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