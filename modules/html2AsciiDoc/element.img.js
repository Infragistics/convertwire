(function(module){
	
	module.element = 'img';
	
	module.convert = function($e){
		var src = $e.attr('src');
		var alt = $e.attr('alt');
		var returnValue = '';
		
		src = (typeof src !== "undefined")? src : '';
		alt = (typeof alt !== "undefined")? alt : '';
		
		var convert = src.length > 0;
		
		if (convert) {
			returnValue = ' image:' + src + '[' + alt + '] ';	
		}
		
		return returnValue;
	};
	
}(module.exports));