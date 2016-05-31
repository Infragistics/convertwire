var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => SurfaceChartLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('SurfaceChartLink')
	},
	{
		name: 'build-variables: ApiLinkBase => SurfaceChartLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('SurfaceChartLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => SurfaceChartAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('SurfaceChartAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => SurfaceChartNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('SurfaceChartNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => SurfaceChartNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('SurfaceChartNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => SurfaceChartName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('SurfaceChartName')
	},
	{
		name: 'build-variables: ControlsBase => SurfaceChartBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('SurfaceChartBase')
	}
];