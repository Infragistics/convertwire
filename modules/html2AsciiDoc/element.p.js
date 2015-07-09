(function(module){
	
	var _ = require('lodash');
	
	module.convert = function($e, childContent){
		var text = childContent;	
		text = (_.isUndefined(text))? '' : text;
		return text;
	};
	
}(module.exports));