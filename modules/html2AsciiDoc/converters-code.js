(function (module) {

	var highlightRegEx = /highlight highlight-(\S+)/;
	var mapper = require('./source-code-name-map.js');
	var buildFlags = require('./converters-build-flags.js');
	
	var wrapCodeBlock = (content) => {
		return '----\n' + content + '\n----';
	};
	
	var getLanguage = (node) => {
		var value = '';
		
		if(node.id){
			if(node.id.match(/Example_/)){
				value = node.id.substr(node.id.indexOf('_') + 1, node.id.length);
			} else {
				value = getLanguage(node.parentNode);
			}			
		}

		return value.toLowerCase();
	};

	var preCode = {
		filter: function (node) {
			var match = false;
			
			match = (node.nodeName === 'PRE' &&
					 node.firstChild &&
					 node.firstChild.nodeName === 'CODE');
			
			return match;
		},
		replacement: function (content, node) {
			var language, prefix, value;
			
			language = getLanguage(node);
			
			prefix = '';
			
			if (language.length > 0) {
				prefix = '[source,' + mapper.map(language) + ']\n';
			}
				
			value = prefix + wrapCodeBlock(node.textContent);
			
			if(buildFlags.hasDocXBuildFlags(node)){
				value = buildFlags.wrapWithBuildFlags(value, node);
			} else {
				value = '\n\n' + value + '\n\n';
			}
			
			return value;
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
			var language, value;
			
			language = node.parentNode.className.match(highlightRegEx)[1];
			value = '[source,' + language + ']' + node.textContent(node.textContent);
			
			if(buildFlags.hasDocXBuildFlags(node)){
				value = buildFlags.wrapWithBuildFlags(value, node);
			} else {
				value = '\n\n' + value + '\n\n';
			}
			
			return value;
		}
	};

	var codeDiv = {
		filter: function (node) {
			var match = false;
			          
            match = (node.nodeName === 'CODE');
				
			return match;
		},
		replacement: function (content, node) {
			var language = '', value;
			
            if(highlightRegEx.test(node.parentNode.className)){
                language = ',' + node.parentNode.className.match(highlightRegEx)[1];
            }
            
			value = '[source' + language + ']\n' + wrapCodeBlock(node.textContent);
			
			if(buildFlags.hasDocXBuildFlags(node)){
				value = buildFlags.wrapWithBuildFlags(value, node);
			} else {
				value = '\n\n' + value + '\n\n';
			}
			
			return value;
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
			
			match = (node.nodeName === 'PRE' && node.id !== 'metadata');
			
			return match;
		},
		replacement: function (content, node) {
			var id, language, parts, prefix, value;
			
			id = node.parentNode.id;
			language = (id.length > 0) ? id : '';
			parts = language.split('_');
			prefix = '';
			
			if (language.length > 0) {
				language = (parts.length > 1) ? parts[1].toLowerCase() : language;
				prefix = '[source,' + mapper.map(language) + ']\n';
			}
			
			value = prefix + wrapCodeBlock(node.textContent);
			
			if(buildFlags.hasDocXBuildFlags(node)){
				value = buildFlags.wrapWithBuildFlags(value, node);
			} else {
				value = '\n\n' + value + '\n\n';
			}
			
			return value;
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