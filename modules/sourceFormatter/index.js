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
		
		// get flags from container
		if($flaggedContainer.attr('style')){
			style = $flaggedContainer.attr('style').toLowerCase().trim();
            style = style.replace(/ ?display: ?(none|block) ?; ?/,'');      
			elementFlags = elementFlags.concat(style.replace(/hs-build-flags: /, '').split(',')); 
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
				
				elementFlags = elementFlags.concat(match.split(','));
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
			var $flaggedContainer, $parent, uniqueFlags, domIndex;
			
			$flaggedContainer = $(container);
			$parent = $flaggedContainer.parent();
			domIndex = $flaggedContainer.index();
			
			var _clone = $flaggedContainer.clone();
			$flaggedContainer.remove();
			
			uniqueFlags = formatter.getUniqueFlags($flaggedContainer);
			
			uniqueFlags.forEach(function(flag){
				var $clone, $container, id;
				
				id = Math.floor(Math.random(1,100000) * 10000000);
				
				$container = $(`<div id="${id}">`);
				$clone = _clone.clone();
				$clone.attr('style', 'hs-build-flags: ' + flag);
				
				$container.append('\n<!--- ' + flag + ' --->\n');								
				$container.append($clone);
				$container.append('\n<!--- /' + flag + ' --->\n');
                
                if($parent.is('li')){
                    var parentHtml = $parent.html();
                    var bracketIndex = parentHtml.indexOf('<');
                    parentHtml = '<span>' + parentHtml.splice(bracketIndex, 0, '</span>');
                    $parent.html(parentHtml);
				    domIndex = $(`#${id}`).index();
                }
				
				$parent.insertAt($container, domIndex);			
				domIndex = $(`#${id}`).index();
			});
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

if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.splice = function(start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}