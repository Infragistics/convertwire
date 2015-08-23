(function (module) {
	
	var ifDefTags = [
		'img',
		'div',
		'ul',
		'li'
	];
	
	module.hasDocXBuildFlags = function(node){
		var match = false;
		
		var elementHasBuildFlags = function(){
			return typeof node.style.hsBuildFlags !== 'undefined';
		};
		
		var elementHasSameBuildFlagsAsParent = function(){
			return node.style.hsBuildFlags === node.parentNode.style.hsBuildFlags
		};
		
		if(elementHasBuildFlags()){
			if(elementHasSameBuildFlagsAsParent()){
				match = false;
			} else {
				match = true;
			}
		}
		
		return match;
	};
	
	module.wrapWithBuildFlags = function(content, node){
		var returnValue, flags, isElementThatNeedsIfDef;
		
		returnValue = content;
		flags = node.style.hsBuildFlags;
		
		isElementThatNeedsIfDef = function(){
			return ifDefTags.indexOf(node.nodeName.toLowerCase()) >= 0;
		};
		
		if(flags.length > 0) {
			
			if(isElementThatNeedsIfDef()){
				flags = flags.replace(/,/g, '+');
				returnValue = '\n\nifdef::' + flags +'[]\n'
				returnValue += content + '\n';
				returnValue += 'endif::' + flags + '[]\n\n'; 
			} else {
				flags = flags.replace(/,/g, '.target-');
				returnValue = 'pick:[target-' + flags + '="' + content + '"]';	
			}
		}
		
		return returnValue;
	};

} (module.exports));