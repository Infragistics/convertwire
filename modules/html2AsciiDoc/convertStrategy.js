(function(module){
	
	var convertersPath = '../../modules/html2AsciiDoc/';
	
	var converters = {
		a: require(convertersPath + 'element.a.js'),
		p: require(convertersPath + 'element.p.js'),
		headers: require(convertersPath + 'element.headers.js'),
		img: require(convertersPath + 'element.img.js'),
		div: require(convertersPath + 'element.div.js')
	};
	
	module.convert = function(element, childContent, $){
		var $element = $(element);
		var result = '';
		if($element.is('a')){
			result = converters.a.convert($element, childContent);
		} else if($element.is('p')){
			result = converters.p.convert($element, childContent);
		} else if($element.is('h1,h2,h3,h4,h5,h6')){
			result = converters.headers.convert($element, childContent);
		} else if($element.is('img')){
			result = converters.img.convert($element, childContent);
		} else if($element.is('div')){
			result = converters.div.convert($element, childContent);
		} else {
			result = $element.text();
		}
		return result;
	};
	
}(module.exports));