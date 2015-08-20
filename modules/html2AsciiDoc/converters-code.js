(function (module) {

	var highlightRegEx = /highlight highlight-(\S+)/;
	var mapper = require('./source-code-name-map.js');

	var preCode = {
		filter: function (node) {
			var match = false;
			
			match = (node.nodeName === 'PRE' &&
					 node.firstChild &&
					 node.firstChild.nodeName === 'CODE');
			
			return match;
		},
		replacement: function (content, node) {
			var id, language, parts, prefix;
			
			id = node.parentNode.id;
			language = (id.length > 0) ? id : '';
			parts = language.split('_');
			prefix = '';
			
			if (language.length > 0) {
				language = (parts.length > 1) ? parts[1].toLowerCase() : language;
				prefix = '[source,' + mapper.map(language) + ']\n';
			}
			
			return '\n\n' + prefix + '----\n' + node.textContent + '----\n\n';
		}
	}
	
	var syntaxHighlighted = {
		filter: function (node) {
			var match = false;
			
			match = (node.nodeName === 'PRE' &&
					 node.parentNode.nodeName === 'DIV' &&
					 highlightRegEx.test(node.parentNode.className));
			
			return match;
		},
		replacement: function (content, node) {
			var language = node.parentNode.className.match(highlightRegEx)[1];
			return '\n\n[source,' + language + ']\n----' + node.textContent + '\n----\n\n';
		}
	};

	var codeDiv = {
		filter: function (node) {
			var match = false;
			
			match = (node.nodeName === 'CODE' &&
				node.parentNode.nodeName === 'DIV' &&
				highlightRegEx.test(node.parentNode.className));
				
			return match;
		},
		replacement: function (content, node) {
			var language = node.parentNode.className.match(highlightRegEx)[1];
			return '\n\n[source,' + language + ']\n----' + node.textContent + '----\n\n';
		}
	}
	
	var highlightedDiv = {
		filter: function (node) {
			var match = false;
			
			match = (node.nodeName === 'DIV' &&
				highlightRegEx.test(node.className));
			
			return match;
		},
		replacement: function (content) {
			return '\n\n' + content + '\n\n';
		}
	};
	
	var pre = {
		filter: function (node) {
			var match = false;
			
			match = (node.nodeName === 'PRE');
			
			return match;
		},
		replacement: function (content, node) {
			var id, language, parts, prefix;
			
			id = node.parentNode.id;
			language = (id.length > 0) ? id : '';
			parts = language.split('_');
			prefix = '';
			
			if (language.length > 0) {
				language = (parts.length > 1) ? parts[1].toLowerCase() : language;
				prefix = '[source,' + mapper.map(language) + ']\n';
			}
			
			return '\n\n' + prefix + '----\n' + node.textContent + '----\n\n';
		}
	}
	
	var converters = [];

	converters.push(preCode);
	converters.push(syntaxHighlighted);
	converters.push(codeDiv);
	converters.push(highlightedDiv);
	converters.push(pre);

	module.get = function () {
		return converters;
	};

} (module.exports));