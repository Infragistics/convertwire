//(function (module) {

	'use strict';

//	var cheerio = require('cheerio');
//	var $;
//	var _ = require('lodash');

	var formatter = {
		
		XAM_XF_EX: ['sl','wpf','winrt','winphone'],
		DROID_EX: ['sl','wpf','winphone','winrt','xamarin','winforms'],
		XAML: ['sl','wpf','winphone','winrt','xamarin'],
		
		getUniqueBuildFlags: function($PRE){
			var flags = [], uniqueFlags, $flagContainers;
			
			$flagContainers = $PRE.find('[style^="hs-build-flags"]');
			
			$flagContainers = $flagContainers.add($PRE);
			
			$flagContainers.each(function(){
				var style, elementFlags;
				
				style = $(this).attr('style').toLowerCase();      
				elementFlags = style.replace(/hs-build-flags: /, '').split(','); 
				
				elementFlags.forEach(function(flag){
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
			});
			
			uniqueFlags = _.unique(flags);
			
			return uniqueFlags;
		},
		
		splitSourceBasedOnBuildFlags: function($PRE, flags){
			
			var groupCount = 0;
			
			flags.forEach(function(flag){
				var $newPRE, $flaggedElements;
				
				$newPRE = $PRE.clone();
				$newPRE.attr('style', 'hs-build-flags: ' + flag.toLowerCase());
				
				$flaggedElements = $newPRE.find('[style^="hs-build-flags"]');
				
				$flaggedElements.each(function(){
					var $flaggedElement, containsFlagToRemove;
					
					$flaggedElement = $(this);
										
					containsFlagToRemove = formatter.hasFlagToRemove($flaggedElement, flag);
					
					if(containsFlagToRemove){
						$flaggedElement.remove();
					}
					
					if(formatter.isFlagGroup($flaggedElement)){
						groupCount++
					}
					
				});
				
				$PRE.parent().append('\n<!--- ' + flag + ' --->\n');								
				$PRE.parent().append($newPRE);
				$PRE.parent().append('\n<!--- /' + flag + ' --->\n');
			});
			
			return {
				hasFlagGroup: groupCount > 0
			}
		},
		
		hasFlagToRemove: function($flaggedElement, currentFlag){
			var result, flags, elementFlags;
			
			result = false;
			currentFlag = currentFlag.toLowerCase();
			elementFlags = formatter.getElementFlags($flaggedElement);
			flags = formatter.readFlags(elementFlags);
			
			if(flags.isFlagGroup){
				if(flags.xamXfEx){
					result = !_.contains(formatter.XAM_XF_EX, currentFlag);
				} else if(flags.droidEx){
					result = !_.contains(formatter.DROID_EX, currentFlag);
				} else if(flags.xaml){
					result = !_.contains(formatter.XAML, currentFlag);							
				}
			} else {
				result = !_.contains(elementFlags, currentFlag);
			}
			
			return result;
		},
		
		isFlagGroup: function($flagedElement){
			var elementFlags = formatter.getElementFlags($flagedElement);
			var flags = formatter.readFlags(elementFlags);
			flags.isFlagGroup;
		},
		
		getElementFlags: function($flaggedElement){
			var style = $flaggedElement.attr('style').toLowerCase();
			var elementFlags = style.replace(/hs-build-flags: /, '').toLowerCase().split(',');
			return elementFlags;
		},
		
		readFlags: function(elementFlags) {
												
			var flags = {
				xamXfEx : _.contains(elementFlags, 'xam_xf_ex'),
				droidEx : _.contains(elementFlags, 'droid_ex'),
				xaml : _.contains(elementFlags, 'xaml')
			};
			
			flags.isFlagGroup = flags.xamXfEx || flags.droidEx || flags.xaml;
			
			return flags;
		},
		
		findFlaggedElements: function(){
			var $pres = $('pre');
			var $elements = $(); //initialize an empty object
			
			$pres.each(function(preIndex, pre){
				var $pre, preInfo = {}, parentInfo = {};
				
				$pre = $(pre);
				
				preInfo.style = $pre.attr('style') !== undefined ? $pre.attr('style') : '';
				preInfo.hasBuildFlags = preInfo.style.indexOf('hs-build-flags') !== -1;
				
				parentInfo.style = $pre.parent().attr('style') !== undefined ? $pre.parent().attr('style') : '';
				parentInfo.hasBuildFlags = parentInfo.style.indexOf('hs-build-flags') !== -1;
				
				if(preInfo.hasBuildFlags){
					$elements = $elements.add($pre);
				} else if(parentInfo.hasBuildFlags){
					$elements = $elements.add($pre.parent());
				}
			});
			
			return $elements;
		}
	};
	
	var format = function(htmlString){
		//$ = cheerio.load(htmlString);
		
		var $PREs;
				
		$PREs = formatter.findFlaggedElements();
		
		$PREs.each(function(){
			var $PRE, uniqueFlags;
			
			$PRE = $(this);
			
			if($PRE.attr('id') === 'metadata'){
				return;
			}
			
			uniqueFlags = formatter.getUniqueBuildFlags($PRE);
			var sourceInfo = formatter.splitSourceBasedOnBuildFlags($PRE, uniqueFlags);
			
			if(sourceInfo.hasFlagGroup){
				$PRE.remove();
			} else {
				$PRE.find('[style^="hs-build-flags"]').remove();
			}
			
			//$PRE.remove();
		});
		
		//return $.html();
	}

//} (module.exports));

$(function(){
	format();
});