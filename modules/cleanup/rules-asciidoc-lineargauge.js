var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => LinearGaugeLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('LinearGaugeLink')
	},
	{
		name: 'build-variables: ApiLinkBase => LinearGaugeLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('LinearGaugeLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => LinearGaugeAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('LinearGaugeAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => LinearGaugeNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('LinearGaugeNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => LinearGaugeNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('LinearGaugeNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => LinearGaugeName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('LinearGaugeName')
	},
	{
		name: 'build-variables: ControlsBase => LinearGaugeBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('LinearGaugeBase')
	}
];