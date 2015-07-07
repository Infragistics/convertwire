(function(module){
	
	module.element = 'a';
	
	module.convert = function($e){
		var href = $e.attr('href');
		var text = $e.text();
		var returnValue = '';
		
		href = (typeof href !== "undefined")? href : '';
		text = (typeof text !== "undefined")? text : '';
		
		var convert = href.length > 0 && text.length > 0;
		
		if (convert) {
			returnValue = 'link:' + href + '[' + text + ']';	
		} else {
			returnValue = text;
		}
		
		return returnValue;
	};
	
}(module.exports));