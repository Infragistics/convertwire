(function(module){
	
	var _ = require('lodash');
	
	module.convert = function($e, childContent){
		var level = parseInt($e[0].name[1]);
		var text = childContent;
		var id = $e.attr('id');
		var formatting = '';
		var formattingChar = '=';
		
		text = (_.isUndefined(text))? '' : text;
		id = (_.isUndefined(id))? '' : id;
		
		for (var i = 0; i < level; i++) {
			formatting += formattingChar;	
		}
		
		if (text.length > 0) {
			text = formatting + ' ' + text + '\n';
		}
		
		if(id.length > 0){
			text = '[[' + id + ']]\n' + text;
		}
		
		return text;
	};
	
}(module.exports));