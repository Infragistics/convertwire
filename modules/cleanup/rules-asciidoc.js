var buildVariables = require('./buildVariables.js');
var _ = require('lodash');

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
        name: '{temp:code-start}/{temp:code-end}',
        pattern: /\{temp:code-(start|end)\}/gi,
        replacement: ''
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
		name: 'build-variables: AssemblyPlatform => ApiLink',
		pattern: buildVariables.regex('AssemblyPlatform'),
		replacement: buildVariables.wrap('ApiLink')
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
		name: 'build-variables: ProductAssemblyName => AssemblyName',
		pattern: buildVariables.regex('ProductAssemblyName'),
		replacement: buildVariables.wrap('AssemblyName')
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
		name: 'build-variables: CRL2',
		pattern: buildVariables.regex('AB62A791-93F7-4985-B3E9-FC67170F0851'),
		replacement: buildVariables.wrap('CRL2')
	},
	{
		name: 'build-variables: CRL3',
		pattern: buildVariables.regex('E542A2D2-3728-48FD-899D-567D508B9E3B'),
		replacement: buildVariables.wrap('CRL3')
	},
    {
		name: 'build-variables: WinExcelCLR2',
		pattern: buildVariables.regex('A00A25FA-66B6-4DF9-A3B4-1E3048B3B98C'),
		replacement: buildVariables.wrap('WinExcelCLR2')
	},
    {
		name: 'build-variables: WebExcelCLR3',
		pattern: buildVariables.regex('47EF6E5B-2A26-4A43-BB8B-E6AAC70456D6'),
		replacement: buildVariables.wrap('WebExcelCLR3')
	},
    {
		name: 'build-variables: Win2',
		pattern: buildVariables.regex('2F65C5C4-0749-4790-9961-6B0A194EAB38'),
		replacement: buildVariables.wrap('Win2')
	},
    {
		name: 'build-variables: Web3',
		pattern: buildVariables.regex('2A260688-2BC5-4E1C-9346-751CC715678B'),
		replacement: buildVariables.wrap('Win3')
	},
    {
		name: 'build-variables: WinChartCLR2',
		pattern: buildVariables.regex('852A6B97-388C-4F56-B722-4F08BD3FD8A7'),
		replacement: buildVariables.wrap('WinChartCLR2')
	},
    {
		name: 'build-variables: WebChartCLR3',
		pattern: buildVariables.regex('8D4A1277-50C4-4872-86D2-1435FDBCBD84'),
		replacement: buildVariables.wrap('WebChartCLR3')
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
        name: 'extra-spaces-between-bold-italic',
        pattern: /(  +)/g,
        replacement: (match) => { 
            return ' ';
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
    }
];