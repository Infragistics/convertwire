var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => RadialGaugeLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('RadialGaugeLink')
	},
	{
		name: 'build-variables: ApiLinkBase => RadialGaugeLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('RadialGaugeLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => RadialGaugeAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('RadialGaugeAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => RadialGaugeNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('RadialGaugeNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => RadialGaugeNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('RadialGaugeNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => RadialGaugeName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('RadialGaugeName')
	},
	{
		name: 'build-variables: ControlsBase => RadialGaugeBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('RadialGaugeBase')
	},
	{
		name: 'build-variables: ControlsRangeName => RadialGaugeRange',
		pattern: buildVariables.regex('ControlsRangeName'),
		replacement: buildVariables.wrap('RadialGaugeRange')
	}
];