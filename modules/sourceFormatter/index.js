(function (module) {

	'use strict';
	
	var cheerio = require('cheerio');
	var $;
	var _ = require('lodash');
	
	module.format = function(htmlString){
		$ = cheerio.load(htmlString);

		var $pres, newPres;
		
		$pres = $('pre');
		
		newPres = [];
		
		$pres.each(function(index, pre){
			var $pre, $flagContainers, uniqueFlags, $newPre,
				otherFlags;
			
			$pre = $(pre);
			$flagContainers = $pre.find('[style^="hs-build-flags"]');
			uniqueFlags = [];
			
			$flagContainers.each(function(_index, container){
				var style = $(container).attr('style');      
				var flags = style.replace(/hs-build-flags: /, '').split(','); 
				
				flags.forEach(function(flag){
					if(uniqueFlags.indexOf(flag) === -1){
						uniqueFlags.push(flag);
					}
				});
			});
			
			uniqueFlags.forEach(function(flag){
				$newPre = $pre.clone();
				$newPre.attr('style', 'hs-build-flags: ' + flag);
				otherFlags = _.difference(uniqueFlags, [flag]);
				otherFlags.forEach(function(flagToRemove){
					var flaggedElements;
					
					flaggedElements = $newPre.find('[style^="hs-build-flags"]');
					
					flaggedElements.each(function(){
						var $flaggedElement, containsFlagToRemove, containsFlagToKeep;
						
						$flaggedElement = $(this);
						
						containsFlagToRemove = $flaggedElement.attr('style').indexOf(flagToRemove) > -1;
						containsFlagToKeep = $flaggedElement.attr('style').indexOf(flag) > -1;
						
						if(containsFlagToRemove && (!containsFlagToKeep)){
							$flaggedElement.remove();
						}
					});
				});
				
				$pre.parent().append($newPre);
			});
			
			$pre.remove();
		});

		return $.html();
	};

} (module.exports));