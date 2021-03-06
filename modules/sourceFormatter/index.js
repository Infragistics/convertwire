var isNodejsContext = typeof module !== 'undefined';

const unsupportedFlags = ['sl','win-phone','win-rt'];
 
if(isNodejsContext){
	module = module.exports;
	var cheerio = require('cheerio');
	var $;
	var _ = require('lodash');
} else {
	var module = {};
}

var formatter = {
	
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
		var style, matches, uniques, elementFlags = [], flags = [];

		const WPF_WINUNIVERSAL = 'wpf,win-universal';
		
		// get flags from container
		if($flaggedContainer.attr('style')){
			style = $flaggedContainer.attr('style').toLowerCase().trim();
            style = style.replace(/ ?display: ?(none|block) ?; ?/,''); 
			style = style.replace(/hs-build-flags: /, '');

			if(style === WPF_WINUNIVERSAL){
				elementFlags.push(WPF_WINUNIVERSAL);
			} else {
				elementFlags = elementFlags.concat(style.split(',')); 
			}
		}
		
		// get flags from any children
		matches = $flaggedContainer.html().match(/hs-build-flags: ?(.*?)"/gi);
		if(matches) {
			matches.forEach(function(match){
				match = match
							.trim()
							.replace(/hs-build-flags: ?/, '')
							.replace('"','')
							.replace(';', '')
							.replace(', ', ',');

				if(match === WPF_WINUNIVERSAL){
					elementFlags.push(WPF_WINUNIVERSAL);					
				} else {
					elementFlags = elementFlags.concat(match.split(','));
				}
				
			});
		}
		
		elementFlags.forEach(function(flag){
			flag = flag.trim().toLowerCase();
			flags.push(flag);
		});
		
		uniques = _.uniq(flags);
		
		return uniques; 
	},
	
	duplicateContainersByFlag : function($flaggedContainers){
		$flaggedContainers.each(function(index, container){
			var $flaggedContainer, $parent, uniqueFlags, domIndex, markup, _clone;
			
			$flaggedContainer = $(container);
			$parent = $flaggedContainer.parent();
			domIndex = $flaggedContainer.index();

            var $domContainer = $('<div>');
            
            $flaggedContainer.before($domContainer);
			
			_clone = $flaggedContainer.clone();
			$flaggedContainer.remove();
            
            markup = [];
			
			uniqueFlags = formatter.getUniqueFlags($flaggedContainer);
			
			uniqueFlags.forEach(function(flag){
				var $clone, $container;

				if(unsupportedFlags.indexOf(flag) === -1){				
					$container = $(`<div>`);
					$clone = _clone.clone();
					$clone.attr('style', 'hs-build-flags: ' + flag);
					
					$container.append('\n<!--- ' + flag + ' --->\n');								
					$container.append($clone);
					$container.append('\n<!--- /' + flag + ' --->\n');
					
					markup.push($container.html());
				}
			});
            
            $domContainer.html($domContainer.html() + markup.join('\n\n'));
		});
	}
};

module.format = function(html){
	var $flaggedContainers, value = '';
	
	if(isNodejsContext){
		$ = cheerio.load(html);
	}
	
	$.fn.insertAt = function(elements, index) {
		//var array = $.makeArray(this.children().clone(true));
		var array = _.map(this.children().clone(true), function(element){
			return element;
		});
		array.splice(index, 0, elements);
		this.empty().append(array);
	}
	
	$flaggedContainers = formatter.getFlaggedContainers();
	formatter.duplicateContainersByFlag($flaggedContainers);
	
	if(isNodejsContext){
		value = $.html();	
	}
	
	return value;
};