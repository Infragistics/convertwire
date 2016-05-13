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
	
	var div = {
		filter: 'div',
		replacement: function (content, node) {

			if (buildFlags.hasDocXBuildFlags(node)) {
				content = buildFlags.wrapWithBuildFlags(content, node);
			}

			return `\n\n${content}\n\n`;
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
	
	converters.push(div);
	converters.push(general);
	converters.push(divBuildFlagged);

	module.get = function () {
		return converters;
	};

} (module.exports));