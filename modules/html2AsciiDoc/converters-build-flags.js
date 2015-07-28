(function (module) {
	
	var ifDefTags = [
		'img',
		'div',
		'ul'
	];
	
	module.hasDocXBuildFlags = function(node){
		var style = node.getAttribute('style');
		return /hs-build-flags:/i.test(style);
	};
	
	module.wrapWithBuildFlags = function(content, node){
		var returnValue = content;
		var style = node.getAttribute('style');
		var matches = style.match(/hs-build-flags: (.*)/i);
		var flags;
		
		if(matches.length > 0) {
			
			if(ifDefTags.indexOf(node.nodeName.toLowerCase()) >= 0){
				flags = matches[1].replace(/,/g, '+');
				returnValue = 'ifeval::[{' + flags + '}]\n'
				returnValue += content + '\n';
				returnValue += 'endif::[]\n\n'; 
			} else {
				flags = matches[1].replace(/,/g, '.target-');
				returnValue = 'pick:[target-' + flags + '="' + content + '"]';	
			}
		}
		
		return returnValue;
	};

} (module.exports));