(function(module){
	
	'use strict';
    
    const _ = require('lodash');
	
	module.regex = [
		{
			name: 'style-display-none',
			// includes all possible values for CSS display property
			pattern: / style=\"display:( )?(none|inline|block|contents|list-item|inline-block|inline-table|table|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|flex|inline-flex|grid|inline-grid|ruby|ruby-base|ruby-text|ruby-base-container|ruby-text-container|run-in|inherit|initial|unset)(;)?\"/gi,
			replacement: ''
		},
        {
            name: 'wrap-bare-list-item-content-in-span',
            pattern: /<li(.*?)>([^]+?)<\/li>/gi,
            replacement: function(match, x, y){
                if(!_.startsWith(y, '<')){
                    var index = y.indexOf('<');
                    match = '<li><span>' + y.splice(index, 0, '</span>') + '</li>';
                }
                return match;
            }
        },
        {
            name: 'empty-inline-elements',
            pattern: /<[p|i|em|b|bold|strong|span]>[\s|&nbsp;|&#xA0;]+<\/[p|i|em|b|bold|strong|span]>/gi,
            replacement: ' '
        },
		{
			name: 'non-breaking-space',
			pattern: /&#xA0;/g,
			replacement: '&nbsp;'
		},
		{
			name: 'build-flag:winforms',
			pattern: /A33F8D9D-1A93-4A02-85E3-FC849DE1B8EA/g,
			replacement: 'win-forms'
		},
		{
			name: 'build-flag:winrt',
			pattern: /34ADE70F-C190-412D-A2CE-25D1E1AE0FF8/g,
			replacement: 'win-rt'
		},
		{
			name: 'build-flag:wpf',
			pattern: /\{673B143B-6568-4204-99C0-4548E4AFEF3C\}/g,
			replacement: 'wpf'
		},
		{
			name: 'build-flag:android',
			pattern: /18DC7F35-922E-46A9-9127-9FA472AE43E2/g,
			replacement: 'android'
		},
		{
			name: 'build-flag:android_in',
			pattern: /DROID_IN/g,
			replacement: 'android'
		},
		{
			name: 'build-flag:sl',
			pattern: /\{A72AF817-CD06-4101-A8ED-A0E52FC4DD05\}/g,
			replacement: 'sl'
		},
		{
			name: 'build-flag:winphone',
			pattern: /27968E2C-EB4E-49F9-9A03-2FF58C6428F6/g,
			replacement: 'win-phone'
		},
		{
			name: 'build-flag:xam_xf_ex',
			pattern: /xam_xf_ex/gi,
			replacement: 'xaml-xf-ex'
		},
		{
			name: 'build-flag:droid_ex',
			pattern: /droid_ex/gi,
			replacement: 'android-ex'
		},
		{
			name:'build-flag:winforms2',
			pattern:/(hs\-build\-flags: |,)(winforms)/ig,
			replacement: (match) => {
				return match.replace(/winforms/i, 'win-forms');
			}
		},
		{
			name:'build-flag:winphone',
			pattern:/winphone/ig,
			replacement: 'win-phone'
		},
		{
			name:'build-flag:winrt',
			pattern:/winrt/ig,
			replacement: 'win-rt'
		},
		{
			name: 'add-temp-token-to-images',
			pattern: /\<img (.*?)\>/ig,
			replacement: (match) => {
				return match + '{TEMP_TOKEN}';
			}
		},
		{
			name: 'empty-cell',
			pattern: /<td>\s?<\/td>|<td><([^>]+)>(\s)(<\/([^>]+)>)<\/td>/gi,
			replacement: '<td>{temp:empty-cell}</td>'
		},
        {
			name: 'empty-cell-2',
			pattern: /<td.*?>[\s]+<\/td>/gi,
			replacement: '<td>{temp:empty-cell}</td>'
		},
        {
			name: 'empty-header',
			pattern: /<th>\s?<\/th>|<th><([^>]+)>(\s)(<\/([^>]+)>)<\/th>/gi,
			replacement: '<th>{temp:empty-header}</th>'
		},
        {
			name: 'empty-header-2',
			pattern: /<th.*?>[\s]+<\/th>/gi,
			replacement: '<th>{temp:empty-cell}</th>'
		},
		{
			name: 'empty-html-tags',
			pattern: /<[^\/>][^>]*>\s?<\/[^>]+>/g,
			replacement: (match) => {
                var returnValue, value, tags;
                
                returnValue = '{temp:empty-element}';
                value = match.toLowerCase().replace(/\<\/?/g, '');  
                tags = value.split('>');
                
                if(tags[0] !== tags[1]){
                    returnValue = match;
                }
                
                return returnValue;
            }
		},
		{
			name:'temporary-token',
			pattern:/\{TEMP_TOKEN\}/ig,
			replacement: ''
		},
        {
            name:'stray-style-elements',
            pattern: /<style(?:\r|\n|.)+<\/style>/gi,
            replacement: ''
        }
	];
	
	module.jquery = [
		{
			name: 'add-comment-to-in-document-anchors',
			apply:  ($) => {
				let src = '', dest = '', values = [];
				
				$('a').each((i, a) => {
					let $a = $(a);
					let value = {};
					
					if($a.text().length === 0 && (typeof $a.attr('id') !== 'undefined' || typeof $a.attr('name') !== 'undefined')){
						src = $('<div>').append($a).html();
						src = src.replace(/"/g, '\"?');
						
						$a.html('<span class="temporary">{temp:content}</span>');
						dest = $('<div>').append($a).html();
						
						value.src = src;
						value.dest = dest;
						
						values.push(value);
					}
				});
				
				return values;
			}
		},
        {
            name: 'remove-old-build-variables',
            apply: ($) => {
                let values = [];
                let guidMatchExpression = '{?([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})}?';
                let removeFlags = [
                    '{03CD8027-2F55-4D9F-9B31-15F1CDA89005}',
                    '{7F8A205D-BEEC-4CEE-BF00-9B6A6DE582BB}',
                    '{4522AF82-ECE7-4A43-A30F-FAB0E9311CB1}',
                    '{3464F388-E853-43C5-8CFF-3C3C2F4DE1A3}',
                    '{AE4AFBC6-B7A7-4E4A-8D8E-201B876A8FA4}'
                ];
                
                $('a').each((i, a) => {
                    let $a = $(a);
                    let value = {};
                    
                    let style = $a.attr('style');
                    
                    if(style){
                        let guidMatches = style.match(guidMatchExpression);
                        
                        if(guidMatches && guidMatches.length > 0){
                            let guidsToRemove = _.intersection(removeFlags, guidMatches);
                            if(guidsToRemove.length > 0){
                                value.src = $('<div>').append($a).html();
                                value.dest = '';
                                values.push(value);
                            }
                        }
                    }
                });
                
                return values;
            }
        }
	];

}(module.exports));