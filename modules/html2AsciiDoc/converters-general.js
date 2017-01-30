(function (module) {

	var buildFlags = require('./converters-build-flags.js');
	
	var divBuildFlagged = {
		filter: function(node){
			var match = node.nodeName === 'DIV' &&
                   	    typeof node.style.hsBuildFlags !== 'undefined';
			
			return match;
		},
		replacement: function(content, node){
			if (buildFlags.hasDocXBuildFlags(node)) {
				content = buildFlags.wrapWithBuildFlags(content, node);
			}

			return content;
		}
	};

	var buildFlagElements = {
		filter: 'build-flag',
		replacement: (content, node) => {
			let flags = node.getAttribute('value');
			let type = node.getAttribute('type');
			let value = '';

			if(type === 'begin') {
				value = `ifdef::${flags}[]`;
			} else {
				value = `endif::${flags}[]`;
			}

			return '\n' + value + '\n';
		}
	};
	
	var div = {
		filter: 'div',
		replacement: function (content, node) {

			if (buildFlags.hasDocXBuildFlags(node)) {
				content = buildFlags.wrapWithBuildFlags(content, node);
			}

			return `\n\n${content}\n\n`;
		}
	};
	
	var tt = {
		filter: 'tt',
		replacement: function (content, node) {
			
			content = '`' + content + '`';

			if (buildFlags.hasDocXBuildFlags(node)) {
				content = buildFlags.wrapWithBuildFlags(content, node);
			}

			return content;
		}
	};
	
	var sup = {
		filter: 'sup',
		replacement: function (content, node) {
			
			content = '^' + content + '^';

			if (buildFlags.hasDocXBuildFlags(node)) {
				content = buildFlags.wrapWithBuildFlags(content, node);
			}

			return content;
		}
	};
	
	var sub = {
		filter: 'sub',
		replacement: function (content, node) {
			
			content = '~' + content + '~';

			if (buildFlags.hasDocXBuildFlags(node)) {
				content = buildFlags.wrapWithBuildFlags(content, node);
			}

			return content;
		}
	};

	var general = {
		filter: ['span', 'u', 'font'],
		replacement: function (content, node) {

			if (buildFlags.hasDocXBuildFlags(node)) {
				content = buildFlags.wrapWithBuildFlags(content, node);
			}

			return content;
		}
	};

	var converters = [];
	
	converters.push(tt);
	converters.push(sub);
	converters.push(sup);
	converters.push(buildFlagElements);
	converters.push(div);
	converters.push(general);
	converters.push(divBuildFlagged);

	module.get = function () {
		return converters;
	};

} (module.exports));