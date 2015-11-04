(function (module) {
	
	var _ = require('lodash');
	
	var pickTags = [
		'b', 'big', 'i', 'small', 'tt', 'abbr', 'acronym', 'cite', 
		'dfn', 'em', 'kbd', 'strong', 'samp', 'var', 'a', 'bdo', 'br', 
		'map', 'object', 'q', 'script', 'span', 'sub', 'sup', 'label'
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
		var returnValue, flags, isElementThatNeedsPick, ensureFlagValues;
		
		returnValue = content;
		flags = node.style.hsBuildFlags.toLowerCase();
		
		ensureFlagValues = function(){
			// These adjustments compensate for a bug in
			// how the to-markdown module parses a node's
			// style collection.
			if(flags.indexOf('"') > -1){
				flags = flags.substr(0, flags.indexOf('"'));
			}
			
			if(flags.indexOf('>') > -1){
				flags = flags.substr(0, flags.indexOf('>'));
			}
		};
			
		isElementThatNeedsPick = function(){
			return pickTags.indexOf(node.nodeName.toLowerCase()) >= 0;
		};
		
		ensureFlagValues();
		
		if(flags.length > 0) {
			
			if(isElementThatNeedsPick()){
				flags = flags.replace(/,/g, '.');
				returnValue = 'pick:[' + flags + '="' + content + '"]';	
			} else {
				returnValue = '\n\nifdef::' + flags +'[]'
				returnValue += (_.startsWith(content, '\n'))? '' : '\n';
				returnValue += content + '\n';
				returnValue += 'endif::' + flags + '[]\n\n'; 
			}
		}
		
		return returnValue;
	};

} (module.exports));