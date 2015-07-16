(function(){

	'use strict';

	function cell(content, node) {
	  var index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
	  var prefix = ' ';
	  if (index === 0) { prefix = '| '; }
	  return prefix + content + ' |';
	}
	
	var highlightRegEx = /highlight highlight-(\S+)/;
	var mapper = require('./source-code-name-map.js');
	
	module.exports = [
	  {
	    filter: 'br',
	    replacement: function () {
	      return '\n';
	    }
	  },
	  {
	    filter: ['del', 's', 'strike'],
	    replacement: function (content) {
	      return '[line-through]*' + content + '*';
	    }
	  },
	
	  {
	    filter: function (node) {
	      return node.type === 'checkbox' && node.parentNode.nodeName === 'LI';
	    },
	    replacement: function (content, node) {
	      return (node.checked ? '[x]' : '[ ]') + ' ';
	    }
	  },
	
	  {
	    filter: ['th', 'td'],
	    replacement: function (content, node) {
	      return cell(content, node);
	    }
	  },
	
	  {
	    filter: 'tr',
	    replacement: function (content, node) {
	      var borderCells = '';  
	      return '\n' + content + (borderCells ? '\n' + borderCells : '');
	    }
	  },
	
	  {
	    filter: 'table',
	    replacement: function (content) {
	      return '\n\n[options="header"]\n|=======================' + content + '\n|=======================\n\n';
	    }
	  },
	  
	  {
	    filter: ['thead', 'tbody', 'tfoot'],
	    replacement: function (content) {
	      return content;
	    }
	  },
	
	  // Fenced code blocks
	  {
	    filter: function (node) {
	      return node.nodeName === 'PRE' &&
	             node.firstChild &&
	             node.firstChild.nodeName === 'CODE';
	    },
	    replacement: function(content, node) {
			var id = node.parentNode.id;
			var language = (id.length > 0)? id : '';
			var parts = language.split('_');
			language = (parts.length > 0)? parts[1].toLowerCase() : language;
			language = mapper.map(language);
			return '\n\n[source,' +  language + ']\n----\n' + node.textContent + '\n----\n\n';
	    }
	  },
	
	  // Syntax-highlighted code blocks
	  {
	    filter: function (node) {
	      return node.nodeName === 'PRE' &&
	             node.parentNode.nodeName === 'DIV' &&
	             highlightRegEx.test(node.parentNode.className);
	    },
	    replacement: function (content, node) {
	      var language = node.parentNode.className.match(highlightRegEx)[1];
		  return '\n\n[source,' +  language + ']\n----' + node.textContent + '\n----\n\n';
	    }
	  },
	  
	  {
	    filter: function (node) {
	      return node.nodeName === 'CODE' &&
	             node.parentNode.nodeName === 'DIV' &&
	             highlightRegEx.test(node.parentNode.className);
	    },
	    replacement: function (content, node) {
	      var language = node.parentNode.className.match(highlightRegEx)[1];
		  return '\n\n[source,' +  language + ']\n----' + node.textContent + '\n----\n\n';
	    }
	  },
	
	  {
	    filter: function (node) {
	      return node.nodeName === 'DIV' &&
	             highlightRegEx.test(node.className);
	    },
	    replacement: function (content) {
	      return '\n\n' + content + '\n\n';
	    }
	  }
	];

}());