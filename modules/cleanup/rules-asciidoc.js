var buildVariables = require('./buildVariables.js'); 

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
		name: 'temp-token=>list:start',
		pattern: /\<temp-token role=\"list:start\"\>/g,
		replacement: ''
	},
	{
		name: 'empty-cell',
		pattern: /{temp:empty-cell}/ig,
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
	}	
	// ----------------------------------------------
];