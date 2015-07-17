(function(module){
	
	var createCell = function(content, node) {
		var index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
		var prefix = (index === 0)? '| ' : ' ';
		var isLastCellInRow = node.cellIndex === (node.parentNode.children.length - 1);
		var suffix = (isLastCellInRow)? '' : ' |';
		return prefix + content + suffix;
	}
	
	var cell = {
		filter: ['th', 'td'],
	    replacement: function (content, node) {
	      return createCell(content, node);
	    }
	};
	
	var row = {
		filter: 'tr',
	    replacement: function (content, node) {
	      var borderCells = '';  
	      return '\n' + content + (borderCells ? '\n' + borderCells : '');
	    }
	};
	
	var table = {
		filter: 'table',
	    replacement: function (content) {
	      return '\n\n[options="header"]\n|=======================' + content + '\n|=======================\n\n';
	    }
	};
	
	var bodyHeaderFooter = {
		filter: ['thead', 'tbody', 'tfoot'],
	    replacement: function (content) {
	      return content;
	    }
	};
	
	var converters = [];
	
	converters.push(cell);
	converters.push(row);
	converters.push(table);
	converters.push(bodyHeaderFooter);
	
	module.get = function(){
		return converters;
	};	
	
}(module.exports));