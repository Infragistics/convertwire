var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => PieChartLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('PieChartLink')
	},
	{
		name: 'build-variables: ApiLinkBase => PieChartLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('PieChartLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => PieChartAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('PieChartAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => PieChartNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('PieChartNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => PieChartNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('PieChartNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => PieChartName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('PieChartName')
	},
	{
		name: 'build-variables: ControlsBase => PieChartBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('PieChartBase')
	}
];