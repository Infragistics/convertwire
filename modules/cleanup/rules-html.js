module.exports.regex = [
	{
		name: 'style-display-none',
		// includes all possible values for CSS display property
		pattern: / style=\"display:( )?(none|inline|block|contents|list-item|inline-block|inline-table|table|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|flex|inline-flex|grid|inline-grid|ruby|ruby-base|ruby-text|ruby-base-container|ruby-text-container|run-in|inherit|initial|unset)(;)?\"/gi,
		replacement: ''
	},
	{
		name: 'non-breaking-space',
		pattern: /&#xA0;/g,
		replacement: '&nbsp;'
	},
	{
		name: 'build-flag:winforms',
		pattern: /A33F8D9D-1A93-4A02-85E3-FC849DE1B8EA/g,
		replacement: 'winforms'
	},
	{
		name: 'build-flag:winrt',
		pattern: /34ADE70F-C190-412D-A2CE-25D1E1AE0FF8/g,
		replacement: 'winrt'
	},
	{
		name: 'build-flag:wpf',
		pattern: /{673B143B-6568-4204-99C0-4548E4AFEF3C}/g,
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
		pattern: /{A72AF817-CD06-4101-A8ED-A0E52FC4DD05}/g,
		replacement: 'sl'
	},
	{
		name: 'build-flag:',
		pattern: /27968E2C-EB4E-49F9-9A03-2FF58C6428F6/g,
		replacement: 'winphone'
	},
	/*{
		name: 'empty-html-tags',
		pattern: /<[^\/>][^>]*><\/[^>]+>/g,
		replacement: ''
	}*/
];

module.exports.jquery = [
	{
		name: 'add-comment-to-in-document-anchors',
		apply:  ($) => {
			var src = '', dest = '';
			
			$('a').each((i, a) => {
				var $a = $(a);
				if($a.text().length === 0 && (typeof $a.attr('id') !== 'undefined')){
					src = $('<div>').append($a).html();
					
					$a.html('<!-- in-document link --->');
					dest = $('<div>').append($a).html();
				}
			});
			
			return {
				src: src,
				dest: dest
			};
		}
	}
];