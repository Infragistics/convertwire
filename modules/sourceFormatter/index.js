var isNodejsContext = typeof module !== 'undefined';
 
if(isNodejsContext){
	module = module.exports;
	var cheerio = require('cheerio');
	var $;
	var _ = require('lodash');
} else {
	var module = {};
}

var formatter = {
	
	XAM_XF_EX: ['sl','wpf','winrt','winphone'],
	DROID_EX: ['sl','wpf','winphone','winrt','xamarin','winforms'],
	XAML: ['sl','wpf','winphone','winrt','xamarin'],
	
	getContainerInfo: function($pre){
		var info = {}, style;
		
		style = $pre.attr('style') !== undefined ? $pre.attr('style') : '';
		info.hasBuildFlags = style.indexOf('hs-build-flags') !== -1;
		
		style = $pre.parent().attr('style') !== undefined ? $pre.parent().attr('style') : '';
		info.parentHasBuildFlags = style.indexOf('hs-build-flags') !== -1;
		
		info.hasChildElementsWithBuildFlags = $pre.find('[style^="hs-build-flags"]').length > 0;
		
		return info;
	},
	
	getFlaggedContainers : function(){
		var $pres = $('pre');
		var $elements = $(); //initialize an empty jquery object
		
		$pres.each(function(preIndex, pre){
			var $pre, info;
			
			$pre = $(pre);
			
			info = formatter.getContainerInfo($pre);
			
			if(info.hasBuildFlags || info.hasChildElementsWithBuildFlags){
				$elements = $elements.add($pre);
			} else if(info.parentHasBuildFlags){
				$elements = $elements.add($pre.parent());
			}
		});
		
		return $elements;	
	},
	
	getUniqueFlags : function($flaggedContainer){
		var style, matches, elementFlags = [], flags = [];
		
		// get flags from container
		if($flaggedContainer.attr('style')){
			style = $flaggedContainer.attr('style').toLowerCase().trim();      
			elementFlags = elementFlags.concat(style.replace(/hs-build-flags: /, '').split(',')); 
		}
		
		// get flags from any children
		matches = $flaggedContainer.html().match(/(hs-build-flags:( )?.*(;)?")/g);
		if(matches) {
			matches.forEach(function(match){
				match = match
							.trim()
							.replace(/hs-build-flags:( )?/, '')
							.replace('"','')
							.replace(', ', ',');
				
				elementFlags = elementFlags.concat(match.split(','));
			});
		}
		
		elementFlags.forEach(function(flag){
			
			flag = flag.trim().toLowerCase();
			
			if(flag === 'xam_xf_ex'){
				flags = flags.concat(formatter.XAM_XF_EX);
			} else if(flag === 'droid_ex'){
				flags = flags.concat(formatter.DROID_EX);
			} else if(flag === 'xaml'){
				flags = flags.concat(formatter.XAML);
			} else {
				flags.push(flag);
			}
		});
		
		return _.unique(flags); 
	},
	
	duplicateContainersByFlag : function($flaggedContainers){
		$flaggedContainers.each(function(index, container){
			var $flaggedContainer, uniqueFlags;
			
			$flaggedContainer = $(container);
			uniqueFlags = formatter.getUniqueFlags($flaggedContainer);
			
			uniqueFlags.forEach(function(flag){
				var $clone;
				
				$clone = $flaggedContainer.clone();
				$clone.attr('style', 'hs-build-flags: ' + flag);
				
				$flaggedContainer.parent().append('\n<!--- ' + flag + ' --->\n');								
				$flaggedContainer.parent().append($clone);
				$flaggedContainer.parent().append('\n<!--- /' + flag + ' --->\n');
			});
			
			$flaggedContainer.remove();
		});
	}
};

module.format = function(html){
	var $flaggedContainers, value = '';
	
	if(isNodejsContext){
		$ = cheerio.load(html);
	}
	
	$flaggedContainers = formatter.getFlaggedContainers();
	formatter.duplicateContainersByFlag($flaggedContainers);
	
	if(isNodejsContext){
		value = $.html();	
	}
	
	return value;
};