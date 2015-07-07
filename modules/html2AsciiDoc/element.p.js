(function(module){
	
	module.element = 'p';
	
	module.convert = function($e){
		var text = $e.text();	
		text = (typeof text !== "undefined")? text : '';
		return text;
	};
	
}(module.exports));