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
            var value = false;
            var style = node.getAttribute('style');
             
            if(style && style.indexOf('hs-build-flags') !== -1) {
                value = true;
            }
            
			if(typeof node.style.hsBuildFlags !== 'undefined'){
                value = true;
            };
            
            return value;
		};
		
		var elementHasSameBuildFlagsAsParent = function(){
            var value = false;
            var style = node.getAttribute('style');
            var parentStyle = node.parentNode.getAttribute('style'); 
            
            if(style && parentStyle){
              if(style.toLowerCase() == parentStyle.toLowerCase()){
                value = true;
              }  
            } 
            
            if(node.style.hsBuildFlags && node.parentNode.style.hsBuildFlags){
                value = node.style.hsBuildFlags === node.parentNode.style.hsBuildFlags; 
            }
            
            return value;
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
		var returnValue, flags, isElementThatNeedsPick, ensureFlagValues, style, matches;
		
		returnValue = content;
        
        if(node.style.hsBuildFlags){
		  flags = node.style.hsBuildFlags.toLowerCase();  
        } else {
            style = node.getAttribute('style');
            if(style){
                style = style.replace(/\s/g, '');
                style += ';'; //add extra semicolon to make regex work
                matches = style.match(/hs-build-flags:(.*?);/);
                if(matches && matches.length > 0){
                    flags = matches[1];
                }
            }
        }
		
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
			
			flags = flags.replace(/ /g, '');
			
			if(isElementThatNeedsPick()){
				returnValue = ' pick:[' + flags + '="' + content + '"] ';	
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