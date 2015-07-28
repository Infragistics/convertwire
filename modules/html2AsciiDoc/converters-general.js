(function (module) {

	var buildFlags = require('./converters-build-flags.js');

	var div = {
		filter: 'div',
		replacement: function (content, node) {

			if (buildFlags.hasDocXBuildFlags(node)) {
				content = buildFlags.wrapWithBuildFlags(content, node);
			}

			return content;
		}
	};

	var converters = [];
	
	converters.push(div);

	module.get = function () {
		return converters;
	};

} (module.exports));