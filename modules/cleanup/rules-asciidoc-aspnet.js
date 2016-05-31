var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: OldSamplesUrl => SamplesURL',
		pattern: buildVariables.regex('OldSamplesUrl'),
		replacement: buildVariables.wrap('SamplesURL')
	},
	{
		name: 'build-variables: jQueryApiUrl => jQueryApiLink',
		pattern: buildVariables.regex('jQueryApiUrl'),
		replacement: buildVariables.wrap('jQueryApiLink')
	}
];