module = module.exports;

var rules = [
	{
		name: 'ordered-list-stray-slash',
		pattern: /[1-9]\./g,
		replacement: function(match){
			return match.replace('\.', '.')
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
		name: 'docXGuid',
		pattern: /([0-9A-Fa-f]{8}`[0-9A-Fa-f]{4}`[0-9A-Fa-f]{4}`[0-9A-Fa-f]{4}`[0-9A-Fa-f]{12})/g,
		replacement: function(match){
			return match.replace(/`/g, '-');
		}
	}
];

module.clean = function(source){
	
	rules.forEach((rule) => {
		source = source.replace(rule.pattern, rule.replacement);
	});
	
	return source;
};