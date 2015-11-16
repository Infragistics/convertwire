module.exports = [
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
	}
];