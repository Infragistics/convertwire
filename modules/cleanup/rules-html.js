(function(module){
	
	'use strict';
    
    const _ = require('lodash');
	const buildVariables = require('./buildVariables.js');
	
	var sanitize = (value) => {
		return value.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
	};
	
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
            replacement: function(match, attributes, content){
                if(!_.startsWith(content, '<')){
                    var index = content.indexOf('<');
                    match = '<li' + attributes  + '><span>' + content.splice(index, 0, '</span>') + '</li>';
                }
                return match;
            }
        },

		/*
		 * removing for now per conversation with Liz. Using line
		 * continuation characters will end up breaking notes, code 
		 * listings and other nested elements, so its worth 
		 * not having all lines indented in favor of working content 
		{
			name: 'line-continuation-for-list-items',
			pattern: /<li>(.|\s)+?<\/li>/gi,
			replacement: (match, markup) => {
				match = match.replace(/<p>|<div>|<br>|<br \/>/gi, (tag) => {
					return `<div>+</div>` + tag;
				});

				match = match.replace(/\n\n\+\n/gi, '\n+');

				return match;
			}
		}, */

        {
            name: 'empty-inline-elements',
            pattern: /<[p|i|em|b|bold|strong|span]>(\s|&nbsp;|&#xA0;)+<\/[p|i|em|b|bold|strong|span]>/gi,
            replacement: ' '
        },
		{
			name: 'non-breaking-space',
			pattern: /&#xA0;/g,
			replacement: '&nbsp;'
		},
		{
			name: 'build-flag:winforms',
			pattern: buildVariables.guidRegex('A33F8D9D-1A93-4A02-85E3-FC849DE1B8EA'),
			replacement: 'win-forms'
		},
		{
			name: 'build-flag:winrt',
			pattern: buildVariables.guidRegex('34ADE70F-C190-412D-A2CE-25D1E1AE0FF8'),
			replacement: 'win-rt'
		},
		{
			name: 'build-flag:wpf',
			pattern: buildVariables.guidRegex('673B143B-6568-4204-99C0-4548E4AFEF3C'),
			replacement: 'wpf'
		},
		{
			name: 'build-flag:android',
			pattern: buildVariables.guidRegex('18DC7F35-922E-46A9-9127-9FA472AE43E2'),
			replacement: 'android'
		},
		{
			name: 'build-flag:android_in',
			pattern: /DROID_IN/g,
			replacement: 'android'
		},
		{
			name: 'build-flag:sl',
			pattern: buildVariables.guidRegex('A72AF817-CD06-4101-A8ED-A0E52FC4DD05'),
			replacement: 'sl'
		},
		{
			name: 'build-flag:winphone',
			pattern: buildVariables.guidRegex('27968E2C-EB4E-49F9-9A03-2FF58C6428F6'),
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
			replacement: 'droid-ex'
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
			replacement: (match) => {
				
				var returnValue = '<td>{temp:empty-cell}</td>';
				
				match = match.replace(/\<td\>/i, '').replace(/\<\/td\>/i, '');
				
				if(/[a-zA-Z0-9]/.test(match)){
					returnValue = `<td>${match}</td>`;
				}
				
				return returnValue;
			}
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
					match = match.replace(/="\?/, '="').replace(/"\?>/, '">');
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
			name:'remove-autoupdate-style-attribute',
			pattern: /style=\"auto-update-caption:\s?true"|false"/gi,
			replacement: ''
		},

        {
            name:'stray-style-elements',
            pattern: /<style(?:\r|\n|.)+<\/style>/gi,
            replacement: ''
        },
		{
			name: 'removes-innovasys-widget-namespace-node',
			pattern: /<\?.+\/>/g,
			replacement: ''
		},

		{
			name: 'removes-extra-note-label-english',
			pattern: /<p.+>Note:<\/p>\s?<div class="?ig-note"?>/gi,
			replacement: '<div class="ig-note">'
		},

		{
			name: 'removes-extra-note-label-japanese',
			pattern: /<div class="note">\s? {1,}<strong>注:<\/strong>/gi,
			replacement: '<div class="ig-note">'
		},
		
		{
			name: 'adds-a-P-element-before-unformatted-content-after-a-title',
			pattern: /<\/h1>\s+(.+)</gi,
			replacement: (match, text) => {
				if(!/</.test(text[0])){
					match = match.replace(text, '<p>' + text);
				}
				return match;
			}
		},
		
		{
			name: 'strip-out-font-styles',
			pattern: /style="font-family: (.+)" /gi,
			replacement: ''
		},

		{
			name: 'remove-non-build-flag-styles',
			pattern: /style="(.+?)"/gi,
			replacement: (match, type) => {
				if(!/hs-build-flags/gi.test(type)){
					match = '';
				}
				return match;
			}
		},
		
		{
			name: 'build-flags: aspnet-clr2',
			pattern: buildVariables.guidRegex('AB62A791-93F7-4985-B3E9-FC67170F0851'),
			replacement: 'aspnet-clr2'
		},
		{
			name: 'build-flags: aspnet',
			pattern: buildVariables.guidRegex('E542A2D2-3728-48FD-899D-567D508B9E3B'),
			replacement: 'aspnet'
		},
		{
			name: 'build-flags: win-forms-clr2',
			pattern: buildVariables.guidRegex('A00A25FA-66B6-4DF9-A3B4-1E3048B3B98C'),
			replacement: 'win-forms-clr2'
		},
		{
			name: 'build-flags: aspnet',
			pattern: buildVariables.guidRegex('47EF6E5B-2A26-4A43-BB8B-E6AAC70456D6'),
			replacement: 'aspnet'
		},
		{
			name: 'build-flags: win-forms-clr2',
			pattern: buildVariables.guidRegex('2F65C5C4-0749-4790-9961-6B0A194EAB38'),
			replacement: 'win-forms-clr2'
		},
		{
			name: 'build-flags: aspnet',
			pattern: buildVariables.guidRegex('2A260688-2BC5-4E1C-9346-751CC715678B'),
			replacement: 'aspnet'
		},
		{
			name: 'build-flags: win-forms-clr2',
			pattern: buildVariables.guidRegex('852A6B97-388C-4F56-B722-4F08BD3FD8A7'),
			replacement: 'win-forms-clr2'
		},
		{
			name: 'build-flags: aspnet',
			pattern: buildVariables.guidRegex('8D4A1277-50C4-4872-86D2-1435FDBCBD84'),
			replacement: 'aspnet'
		},
		{
			name: 'build-flags: win-forms-clr2',
			pattern: buildVariables.guidRegex('15005E59-85F4-4255-AD91-C66026EBB030'),
			replacement: 'win-forms-clr2'
		},
		{
			name: 'build-flags: win-forms',
			pattern: buildVariables.guidRegex('CF21C2C7-9FDA-4779-B7E5-3CEB93F4AF16'),
			replacement: 'win-forms'
		},
		{
			name: 'build-flags: win-forms',
			pattern: buildVariables.guidRegex('13F74CE5-CB08-4922-AF90-39C0329B50FA'),
			replacement: 'win-forms'
		},
		{
			name: 'build-flags: aspnet-clr2',
			pattern: buildVariables.guidRegex('AE4AFBC6-B7A7-4E4A-8D8E-201B876A8FA4'),
			replacement: 'aspnet-clr2'
		},
		{
			name: 'build-flags: win-forms',
			pattern: buildVariables.guidRegex('3464F388-E853-43C5-8CFF-3C3C2F4DE1A3'),
			replacement: 'win-forms'
		},
		{
			name: 'build-flags: aspnet-clr2',
			pattern: buildVariables.guidRegex('4522AF82-ECE7-4A43-A30F-FAB0E9311CB1'),
			replacement: 'aspnet-clr2'
		},
		{
			name: 'build-flags: win-forms',
			pattern: buildVariables.guidRegex('7F8A205D-BEEC-4CEE-BF00-9B6A6DE582BB'),
			replacement: 'win-forms'
		},
		{
			name: 'build-flags: aspnet-clr2',
			pattern: buildVariables.guidRegex('03CD8027-2F55-4D9F-9B31-15F1CDA89005'),
			replacement: 'aspnet-clr2'
		},
		
		{
			name: 'build-flags: win-forms',
			pattern: buildVariables.guidRegex('960134D0-0B95-4AAE-91A3-C2E06F7AEC83'),
			replacement: 'win-forms'
		},
		
		{
			name: 'build-flags: win-forms',
			pattern: buildVariables.guidRegex('1CDD7CD9-3620-4C9E-B860-3E62888E8CD4'),
			replacement: 'win-forms'
		},
		
		{
			name: 'build-flags: win-forms',
			pattern: buildVariables.guidRegex('49B86B31-A986-4DF1-A87A-C671F3D31C5C'),
			replacement: 'win-forms'
		},
		
		{
			name: 'build-flags: docx-online',
			pattern: buildVariables.guidRegex('46CEF21D-3301-4517-A875-A0906828390E'),
			replacement: 'docx-online'
		},
		
		{
			name: 'build-flags: docx-booklet',
			pattern: buildVariables.guidRegex('4AAE0FD4-7313-4FEE-A25F-0785B885F736'),
			replacement: 'docx-booklet'
		},
		
		{
			name: 'build-flags: wpf',
			pattern: buildVariables.guidRegex('B25A8D73-DCF4-46FA-992E-E23DD5CFC37A'),
			replacement: 'wpf'
		},
		
		{
			name: 'build-flags: sl',
			pattern: buildVariables.guidRegex('BDABF795-FD54-442D-8DC6-71F2D8EB48DE'),
			replacement: 'sl'
		},
		
		{
			name: 'build-flags: wpf',
			pattern: buildVariables.guidRegex('BDEA21D1-C8F9-404A-BC55-209AB27AD4F2'),
			replacement: 'wpf'
		},
		
		{
			name: 'build-flags: android',
			pattern: /DROID-IN/gi,
			replacement: 'android'
		},
		{
			name: 'build-flags: android',
			pattern: /DROID-EX/gi,
			replacement: (match) => {
				var value = 'wpf,win-forms,xamarin';
				return value;
			}
		},
		
		{
			name: 'build-flags: wpf',
			pattern: /xam-xf-ex/gi,
			replacement: 'wpf'
		},

		{
			name: 'escape-*',
			pattern: /\*/g,
			replacement: '$$$*$$$'
		},

		{
			name: 'escape-<=',
			pattern: /(<|&lt;)=/gi,
			replacement: (match, lt) => {
				return `$$${lt}=$$`;
			}
		},

		{
			name: 'escape-->',
			pattern: /\-(>|&gt;)/gi,
			replacement: (match, gt) => {
				return `$$-${gt}$$`;
			}
		},

		{
			name: 'escape-->',
			pattern: /(<|&lt;)\-/g,
			replacement: (match, lt) => {
				return `$$${lt}-$$`;
			}
		},

		{
			name: 'unescape-operator-characters-in-code-and-pre',
			pattern: /<(code|pre)(.|\s)+?<\/(code|pre)>/gi,
			replacement: (match) => {
				match = match.replace(/\$\$\*\$\$/g, '*');

				match = match.replace(/\$\$\&lt;=\$\$/g, '<=');
				match = match.replace(/\$\$<=\$\$/g, '<=');

				match = match.replace(/\$\$\&lt;-\$\$/g, '<-');
				match = match.replace(/\$\$<-\$\$/g, '<-');

				match = match.replace(/\$\$-\&gt;\$\$/g, '->');
				match = match.replace(/\$\$->\$\$/g, '->');

				return match;
			}
		},
		
		{
			// this one needs to run last!
			name: 'remove-brackets-from-guids',
			pattern: /\{([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})\}/gi,
			replacement: (match, guid) => {
				return guid;
			}
		}
	];

	var removeEscapeCharacters = (match) => {

	};
	
	module.jquery = [
		/*
		{
			name: 'add-comment-list-continuation-character-to-paragraphs-in-lists',
			apply:  ($) => {
				let src = '', dest = '', values = [];
				
				$('li').each((i, li) => {
					let $li = $(li);
					let value = {};
					
					src = $('<div>').append($li).html();
					src = src
							.replace(/"/g, '\"?')
							.replace(/\(/g, '\\(')
							.replace(/\)/g, '\\)')
							.replace(/\[/g, '\\[')
							.replace(/\]/g, '\\]');
					
					let elements = $li.find('p, div, br');
					
					elements.each((j, element) => {
						let $element = $(element);
						
						if($element.prev().length > 0){
							$element.html('\+ ' + $element.html());							
						}
						
					});
					
					dest = $('<div>').append($li).html();
					
					var matches = dest.match(/<p>\+.{10}/i);
					if(matches){
						matches.forEach((match) => {
							values.push({ 
								src: match.replace('\+ ', ''), 
								dest: match
							});
						});
					}
				});
				
				return values;
			}
		},
		*/
		{
			name: 'add-comment-to-in-document-anchors',
			apply:  ($) => {
				let src = '', dest = '', values = [];
				
				$('a').each((i, a) => {
					let $a = $(a);
					let value = {};
					
					if($a.text().length === 0 && (typeof $a.attr('id') !== 'undefined' || typeof $a.attr('name') !== 'undefined')){
						src = $('<div>').append($a).html();
						src = sanitize(src);
						
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
		/*
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
        }*/
	];

}(module.exports));