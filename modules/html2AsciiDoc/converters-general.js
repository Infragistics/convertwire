(function (module) {

	var buildFlags = require('./converters-build-flags.js');

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

	module.get = function () {
		return converters;
	};

} (module.exports));