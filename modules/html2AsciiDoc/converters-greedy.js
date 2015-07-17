(function (module) {

	var div = {
		filter: 'div',
		replacement: function (content) {
			return content;
		}
	};

	var converters = [];

	converters.push(div);

	module.get = function () {
		return converters;
	};

} (module.exports));