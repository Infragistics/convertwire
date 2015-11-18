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