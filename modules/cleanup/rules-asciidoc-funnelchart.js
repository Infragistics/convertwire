var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => FunnelChartLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('FunnelChartLink')
	},
	{
		name: 'build-variables: ApiLinkBase => FunnelChartLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('FunnelChartLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => FunnelChartAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('FunnelChartAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => FunnelChartNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('FunnelChartNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => FunnelChartNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('FunnelChartNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => FunnelChartName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('FunnelChartName')
	},
	{
		name: 'build-variables: ControlsBase => FunnelChartBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('FunnelChartBase')
	}
];