var buildVariables = require('./buildVariables.js');
var _ = require('lodash');
const regex = require('../regex');

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

module.exports.regex = [
	{
		name: 'ordered-list-stray-slash',
		pattern: /[1-9]\\./g,
		replacement: function(match){
			return match.replace('\\.', '.')
		}
	},

	{
		name: 'moves-title-charaters-into-pick-macro',
		pattern: /(=={1,}) pick:\[.+=\"/gi,
		replacement: (match, titleChars) => {
			return match.replace(titleChars + ' ', '') + titleChars + ' ';
		}
	},

	{
		name: 'trim-new-lines-that-begin-with-italics',
		pattern: /\n _/gi,
		replacement: (match) => {
			return '\n' + match.trim();
		}
	},
	
	{
		name: 'japanese-include-add-localized-file-extension',
		pattern: /(\s{1,}.+\s{1,}\s{1,}.+\s{1,})include::(.+).adoc\[/gi,
		replacement: (match, text, fileName) => {
			var jpPattern = regex.japaneseText;
			if(jpPattern.test(text)){
				match = match.replace(fileName, fileName + '.ja-JP').replace('.html', '');
			}
			return match
		}
	},

	{
		name: 'remove-stray-note-label',
		pattern: /\nNote:\s{1,}\.Note/gi,
		replacement: '\n\n.Note'
	},

    {
        name: '',
        pattern: /\\\.\ /g,
        replacement: () => '. '
    },
    {
        name: 'change-block-build-flags-in-table-headers-to-inline-pick-macros',
        pattern: /\|ifdef::(.*?)\[\](.*?)endif::.*?\[\]/ig,
        replacement: function(match, x, y){
            x = x.replace(',','.');
            var result = `|pick:[${x}="${y}"] `;
            return result;
        }
    },
	{
		name: 'ellpises',
		pattern: /â€¦/g,
		replacement: '...'
	},
	{
		name: 'trademark',
		pattern: /â„¢/g,
		replacement: '&trade;'
	},
	{
		name: 'docX-guid',
		pattern: /([0-9A-Fa-f]{8}`[0-9A-Fa-f]{4}`[0-9A-Fa-f]{4}`[0-9A-Fa-f]{4}`[0-9A-Fa-f]{12})/g,
		replacement: function(match){
			return match.replace(/`/g, '-');
		}
	},
	{
		name: 'note-in-a-table-cell',
		pattern: /(\+ ?)\n.Note:/g,
		replacement: '+\n\n.Note:'
	},
	{
		name: 'note-in-a-table-cell-jp1',
		pattern: /(\+ ?)\n.注:/g,
		replacement: '+\n\n.注:'
	},
	{
		name: 'note-in-a-table-cell-jp2',
		pattern: /(\+ ?)\n.注意:/g,
		replacement: '+\n\n.注:'
	},
    {
		name: 'temp-content',
		pattern: /\{temp:content\}/g,
		replacement: (match) => {
            return '';
        }
	},
	{
		name: 'temp-token=>list:start',
		pattern: /\<temp-token role=\"list:start\"\>/g,
		replacement: ''
	},
	{
		name: 'empty-cell',
		pattern: /\{temp:empty-cell\}/ig,
		replacement: ''
	},
    {
		name: 'empty-header',
		pattern: /\{temp:empty-header\}/ig,
		replacement: ''
	},
    {
        name: 'empty-element',
        pattern: /\{temp:empty-element\}/gi,
        replacement: ''
    },
    {
        name: 'bolded-in-document-links',
        pattern: /<<(.*?),( )?\*(.*?)\*( )?>>/g,
        replacement: function(match){
            return match.replace(/\*/g, '');
        }
    },
    {
        name: 'spaces-in-links',
        pattern: /link:(.*?)\[/g,
        replacement: function(match){
            return match.replace(/~ /g, '~');
        }
    },
    {
        name: 'italics-in-document-links',
        pattern: /<<(.*?),( )?\_(.*?)\_( )?>>/g,
        replacement: function(match){
            match = match.replace(/\_/g, '');
            return ' _' + match + '_ '
        }
    },
    {
        name: 'telephone-number-mask',
        pattern: /\(\#+\)\-\#+\-#+/g,
        replacement: function(match){
            return 'pass:[' + match + ']';
        }
    },
    {
        name: 'include-macro-file-extension',
        pattern: /include::(.*)?\[\]/gi,
        replacement: function(match){
            return match.replace('.html.adoc', '.adoc');
        }
    },
    
    {
        name: '&temp:code-start&/&temp:code-end&',
        pattern: /\&temp:code-(start|end)\&/gi,
        replacement: ''
    },
    
    {
        name: '{temp:note-end}',
        pattern: /\{temp:note-end\}/gi,
        replacement: ''
    },
	
	// fix for: https://github.com/Infragistics/convertwire/issues/134
	{
        name: 'remove-extra-list-start-flags',
        pattern: /\[start=\d\]\s([.]{2,})? /gi,
        replacement: (match, a) => {
			return a + ' ';
		}
    },
	
	// fix for: https://github.com/Infragistics/convertwire/issues/137
	{
		name: 'correctly orders bold/italic markup',
		pattern: /_\*(.+)\*_/g,
		replacement: (match, a) => {
			return `*_${a}_*`;
		}
	},
	
	// fix for: https://github.com/Infragistics/convertwire/issues/138
	{
		name: 'ensures there is a space after bolded terms',
		pattern: /\*.+\*./g,
		replacement: (match) => {
			var lastChar = match[match.length - 1];
			if (lastChar !== ' ') {
				match = match.substr(0, match.length - 1) + ' ' + lastChar;
			}
			return match;
		}
	},
	
	// fix for: https://github.com/Infragistics/convertwire/issues/166
	{
		name: 'remove-space-before-trademark',
		pattern: /\s+™/g,
		replacement: '™'
	},
	
	// fix for: https://github.com/Infragistics/convertwire/issues/169
	{
		name: 'remove-space-before-pick-macro',
		pattern: /\n pick:\[/g,
		replacement: 'pick:['
	},

	// fix for: https://github.com/Infragistics/convertwire/issues/176
	{
		name: 'move-order-token-above-ordered-list-start-token',
		pattern: /(\[start=.\])\s{1,}\.\s{1,}(\[\[.*\]\])\n/g,
		replacement: (match, startToken, anchorToken) => {
			return `${anchorToken}\n${startToken}\n. `;
		}
	},
	
	// fix for: https://github.com/Infragistics/convertwire/issues/175
	{
		name: 'fix-malformed-related-topics',
		pattern: /== ?\n\n\*(Related Topics?)\*/g,
		replacement: (match, label) => {
			return `== ${label}\n\n`;
		}
	},
	
	{
		name: 'fix-malformed-related-topics-jp',
		pattern: /== ?\n\n\*(関連トピック)\*/g,
		replacement: (match, label) => {
			return `== ${label}\n\n`;
		}
	},
	
	// fix for: https://github.com/Infragistics/convertwire/issues/181
	{
		name: 'fix-malformed-related-topics',
		pattern: /(\[start=.\])\s{1,}\.\s{1,}\s{1,}([a-zA-Z]|\*|_)/g,
		replacement: (match, startToken, firstCharacterOfContent) => {
			return `${startToken}\n. ${firstCharacterOfContent}`;
		}
	},
	
	// fix for: https://github.com/Infragistics/convertwire/issues/181
	{
		name: 'fix-malformed-related-topics-2',
		pattern: /(.{3})(Related Topics?)(.{2})?/ig,
		replacement: (match, prefix, label, suffix) => {
			if(/={1,6} /.test(prefix) || suffix === '>>'){
				return match;
			} else {
				return `${prefix}\n\n== ${label}\n`;
			}
		}
	},
	
	{
		name: 'fix-malformed-related-topics-2-jp',
		pattern: /(.{3})(関連トピック)(.{2})?/ig,
		replacement: (match, prefix, label, suffix) => {
			if(/={1,6} /.test(prefix) || suffix === '>>'){
				return match;
			} else {
				return `${prefix}\n\n== ${label}\n`;
			}
		}
	},
	
	{
		name: 'fix-malformed-in-document-links',
		pattern: /\*\s\* (<<.+>>) ?\*/ig,
		replacement: (match, link) => {
			return '* ' + link;
		}
	},
	
	{
		name: 'add-line-break-to-ifdef-rows',
		pattern: /\n\|ifdef/gi,
		replacement: '\n|\nifdef'
	},
	
	{
		name: 'add-passthrough-to-lines-starting-with-.net',
		pattern: /\n\|? ?(\.net)/gi,
		replacement: (match, dotnet) => {
			return match.replace(dotnet, '$$$$' + dotnet + '$$$$');
		}
	},
	
	{
		name: 'add-line-break-to-header-if-one-does-not-exist',
		pattern: /.\n(={1,5}) ./g,
		replacement:  (match, heading) => {
			if(!/]/.test(match)){
				match = match.replace(heading, '\n' + heading);
			}
			return match;
		}
	},
	{
		name: 'fixes-stray-list-token-when-first-word-is-bolded',
		pattern: /(^\n?\*)(\s+)(\*.+\*)/g,
		replacement: (match, prefix, whitespace, suffix) => {
			return prefix + ' ' + suffix;
		}
	},
	
	{
		name: 'put-list-continuation-character-on-own-line',
		pattern: /\n\+ /g,
		replacement:  (match) => {
			return match[0] + match[1] + '\n\n'; 
		}
	},
	
	{
		name: 'place-bold-characters-inside-pick-macro',
		pattern: /\*pick:\[.+\=(.+)\]\*/g,
		replacement:  (match, label) => {
			match = match.substr(1, match.length - 2);
			label = label.replace(/\"/g, '');
			return match.replace(label, '*' + label + '*');
		}
	},

	{
		name: 'remove-extra-space-inside-bold-word',
		pattern: /\* \*( .+)\*/gi,
		replacement: (match, term) => {
			return match.replace(term, term.trim());
		}
	},
    
	// ------------ Build Variables -----------------
	{
		name: 'build-variables:delimiters',
		pattern: /%%(.*?)%%/g,
		replacement: function(match){
			match = match.replace(/%/g, '');
			return buildVariables.wrap(match);
		}
	},
	{
		name: 'build-variables: AssemblyVersion => ApiVersion',
		pattern: buildVariables.regex('AssemblyVersion'),
		replacement: buildVariables.wrap('ApiVersion')
	},
	{
		name: 'build-variables: AssemblyPlatform => ApiPlatform',
		pattern: buildVariables.regex('AssemblyPlatform'),
		replacement: buildVariables.wrap('ApiPlatform')
	},
	{
		name: 'build-variables: ProductNameShort => ProductName',
		pattern: buildVariables.regex('ProductNameShort'),
		replacement: buildVariables.wrap('ProductName')
	},
	{
		name: 'build-variables: ControlsNameRange => ControlsRangeName',
		pattern: buildVariables.regex('ControlsNameRange'),
		replacement: buildVariables.wrap('ControlsRangeName')
	},
	{
		name: 'build-variables: ProductAssemblyName => ApiPlatform',
		pattern: buildVariables.regex('ProductAssemblyName'),
		replacement: buildVariables.wrap('ApiPlatform')
	},
	{
		name: 'build-variables: XpSdkInstallPath => InstallPathXP',
		pattern: buildVariables.regex('XpSdkInstallPath'),
		replacement: buildVariables.wrap('InstallPathXP')
	},
	{
		name: 'build-variables: VistaSdkInstallPath => InstallPathVista',
		pattern: buildVariables.regex('VistaSdkInstallPath'),
		replacement: buildVariables.wrap('InstallPathVista')
	},
	{
		name: 'build-variables: PlatformNameFull => PlatformName',
		pattern: buildVariables.regex('PlatformNameFull'),
		replacement: buildVariables.wrap('PlatformName')
	},
	{
		name: 'build-variables: ProductPlatform => AssemblyName',
		pattern: buildVariables.regex('ProductPlatform'),
		replacement: buildVariables.wrap('AssemblyName')
	},
	{
		name: 'build-variables: ProductVersionCondensed => ProductVersion',
		pattern: buildVariables.regex('ProductVersionCondensed'),
		replacement: buildVariables.wrap('ProductVersion')
	},
	{
		name: 'build-variables: ProductVersionFull => ProductVersion',
		pattern: buildVariables.regex('ProductVersionFull'),
		replacement: buildVariables.wrap('ProductVersion')
	},
	{
		name: 'build-variables: ProductVersionShort => ProductVersion',
		pattern: buildVariables.regex('ProductVersionShort'),
		replacement: buildVariables.wrap('ProductVersion')
	},
	{
		name: 'build-variables: ProductVersionNumber => ProductVersion',
		pattern: buildVariables.regex('ProductVersionNumber'),
		replacement: buildVariables.wrap('ProductVersion')
	},
	{
		name: 'build-variables: VsVersion => PlatformIDE',
		pattern: buildVariables.regex('VsVersion'),
		replacement: buildVariables.wrap('PlatformIDE')
	},
	{
		name: 'build-variables: aspnet-clr2',
		pattern: buildVariables.regex('AB62A791-93F7-4985-B3E9-FC67170F0851'),
		replacement: buildVariables.wrap('aspnet-clr2')
	},
	{
		name: 'build-variables: aspnet',
		pattern: buildVariables.regex('E542A2D2-3728-48FD-899D-567D508B9E3B'),
		replacement: buildVariables.wrap('aspnet')
	},
    {
		name: 'build-variables: WinExcelCLR2',
		pattern: buildVariables.regex('A00A25FA-66B6-4DF9-A3B4-1E3048B3B98C'),
		replacement: buildVariables.wrap('win-forms-clr2')
	},
    {
		name: 'build-variables: aspnet',
		pattern: buildVariables.regex('47EF6E5B-2A26-4A43-BB8B-E6AAC70456D6'),
		replacement: buildVariables.wrap('aspnet')
	},
    {
		name: 'build-variables: Win2',
		pattern: buildVariables.regex('2F65C5C4-0749-4790-9961-6B0A194EAB38'),
		replacement: buildVariables.wrap('win-forms-clr2')
	},
    {
		name: 'build-variables: Web3',
		pattern: buildVariables.regex('2A260688-2BC5-4E1C-9346-751CC715678B'),
		replacement: buildVariables.wrap('aspnet')
	},
    {
		name: 'build-variables: win-forms-clr2',
		pattern: buildVariables.regex('852A6B97-388C-4F56-B722-4F08BD3FD8A7'),
		replacement: buildVariables.wrap('win-forms-clr2')
	},
    {
		name: 'build-variables: aspnet',
		pattern: buildVariables.regex('8D4A1277-50C4-4872-86D2-1435FDBCBD84'),
		replacement: buildVariables.wrap('aspnet')
	},
    {
		name: 'build-variables: win-forms-clr2',
		pattern: buildVariables.regex('15005E59-85F4-4255-AD91-C66026EBB030'),
		replacement: buildVariables.wrap('win-forms-clr2')
	},
    {
		name: 'build-variables: win-forms',
		pattern: buildVariables.regex('CF21C2C7-9FDA-4779-B7E5-3CEB93F4AF16'),
		replacement: buildVariables.wrap('win-forms')
	},
    {
		name: 'build-variables: win-forms',
		pattern: buildVariables.regex('13F74CE5-CB08-4922-AF90-39C0329B50FA'),
		replacement: buildVariables.wrap('win-forms')
	},
    {
		name: 'build-variables: aspnet-clr2',
		pattern: buildVariables.regex('AE4AFBC6-B7A7-4E4A-8D8E-201B876A8FA4'),
		replacement: buildVariables.wrap('aspnet-clr2')
	},
    {
		name: 'build-variables: win-forms',
		pattern: buildVariables.regex('3464F388-E853-43C5-8CFF-3C3C2F4DE1A3'),
		replacement: buildVariables.wrap('win-forms')
	},
    {
		name: 'build-variables:aspnet-clr2',
		pattern: buildVariables.regex('4522AF82-ECE7-4A43-A30F-FAB0E9311CB1'),
		replacement: buildVariables.wrap('aspnet-clr2')
	},
    {
		name: 'build-variables: win-forms',
		pattern: buildVariables.regex('7F8A205D-BEEC-4CEE-BF00-9B6A6DE582BB'),
		replacement: buildVariables.wrap('win-forms')
	},
    {
		name: 'build-variables: aspnet-clr2',
		pattern: buildVariables.regex('03CD8027-2F55-4D9F-9B31-15F1CDA89005'),
		replacement: buildVariables.wrap('aspnet-clr2')
	},
    
	// ----------------------------------------------
    
    {
        name: 'stray-asterisk',
        pattern: /\n\*( )?\n/g,
        replacement: (match) => {
            return '';
        }
    },
    {
        name: 'extra-space-after-italic',
        pattern: /_(.*?)_ \,/gi,
        replacement: function(match) {
            return match.replace('_ ,', '_,')
        }
    },
    {
        name: 'remove-extra-spaces-from-bold-lines',
        pattern: /^\s\*(.*)?\*\s$/gm,
        replacement: function(match){
            var prefix, suffix, value;
            
            prefix = '';
            suffix = '';
            
            if(_.startsWith(match, '\n\n')){
                prefix = '\n\n';
            } else if(_.startsWith(match, '\n')){
                prefix = '\n';    
            }
            
            if(_.startsWith(match, '\n\n')){
                suffix = '\n\n';
            } else if(_.endsWith(match, '\n')){
                suffix = '\n';
            }
            
            if(/\n\*\*\n/.test(match)){
                prefix = suffix = match = '';
            }
            
            match = match.trim();
            
            match = match.replace('* *', '*');
            
            value = prefix + match + suffix;
            
            return value;
        }
    },
	{
        name: 'extra-space-after-italic',
        pattern: /\n{3,}/gi,
        replacement: '\n\n'
    },

	{
		name:'stray-asterisks',
		pattern: /\n\*{1,}\n/g,
		replacement: ''
	},
//*
	{
		name: 'line-breaks',
		pattern: /TEMP_LINE_BREAK/g,
		replacement: ''
	},
//*/

/*
ifdef::xaml[]
----
var radialGauge = new {ControlsName}();
pick:[xaml="this.LayoutRoot.Children.Add(radialGauge);"]  pick:[win-forms="Me.Controls.Add(radialGauge);"] 
----
endif::xaml[]

 */

	{
		name: 'code-blocks',
		pattern: /ifdef::(.+?)\[]\s{0,}----\s{0,}(.|\s)+?----\s{0,}endif/gi,
		replacement: (match, blockFlagList) => {
			var _returnValue = match.replace(/pick:\[(.+?)="(.+?)"\]/gi, (match, pickFlagList, codeSnippet) => {
				var returnValue, matchCount = 0, _pickFlagList, _blockFlagList;
				
				returnValue = codeSnippet;
				_pickFlagList = pickFlagList.toLowerCase().split(',');
				_blockFlagList = blockFlagList.toLowerCase().split(',');

				_pickFlagList.forEach((pickFlag) => {
					_blockFlagList.forEach((blockFlag) => {
						if(pickFlag === blockFlag) {
							matchCount++;
						}
					});
				});

				if(matchCount === 0){
					returnValue = '';
				}
				return returnValue;
			});

			_returnValue = _returnValue.replace(/\n{2,}/g, '\n\n');

			return _returnValue;
		}
	},

	{
		name:'space-before-link',
		pattern: /(.)link:/gi,
		replacement: (match, firstChar) => {
			if(!/ /.test(firstChar)){
			firstChar += ' ';
			match = firstChar + match.substr(1, match.length);
		}
			return match;
		}
	}
];

//----\s+(.+?)\s+---- 			code block
//pick:\[(.+?)="(.+?)"\] 		pick