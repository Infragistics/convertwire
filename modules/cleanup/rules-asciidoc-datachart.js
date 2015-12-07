var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => DataChartLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('DataChartLink')
	},
	{
		name: 'build-variables: ApiLinkBase => DataChartLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('DataChartLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => DataChartAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('DataChartAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => DataChartNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('DataChartNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => DataChartNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('DataChartNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => DataChartName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('DataChartName')
	},
	{
		name: 'build-variables: ControlsBase => DataChartBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('DataChartBase')
	}
];