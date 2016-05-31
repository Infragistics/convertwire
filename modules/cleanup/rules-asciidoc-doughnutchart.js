var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => DoughnutChartLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('DoughnutChartLink')
	},
	{
		name: 'build-variables: ApiLinkBase => DoughnutChartLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('DoughnutChartLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => DoughnutChartAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('DoughnutChartAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => DoughnutChartNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('DoughnutChartNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => DoughnutChartNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('DoughnutChartNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => DoughnutChartName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('DoughnutChartName')
	},
	{
		name: 'build-variables: ControlsBase => DoughnutChartBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('DoughnutChartBase')
	}
];