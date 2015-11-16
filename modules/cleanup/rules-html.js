module.exports = [
	{
		name: 'style-display-none',
		// includes all possible values for CSS display property
		pattern: / style=\"display:( )?(none|inline|block|contents|list-item|inline-block|inline-table|table|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|flex|inline-flex|grid|inline-grid|ruby|ruby-base|ruby-text|ruby-base-container|ruby-text-container|run-in|inherit|initial|unset)(;)?\"/gi,
		replacement: ''
	}
];