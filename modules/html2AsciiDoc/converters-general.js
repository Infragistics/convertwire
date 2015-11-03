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

	var divSpan = {
		filter: ['div', 'span'],
		replacement: function (content, node) {

			if (buildFlags.hasDocXBuildFlags(node)) {
				content = buildFlags.wrapWithBuildFlags(content, node);
			}

			return content;
		}
	};

	var converters = [];
	
	converters.push(divSpan);
	converters.push(divBuildFlagged);

	module.get = function () {
		return converters;
	};

} (module.exports));