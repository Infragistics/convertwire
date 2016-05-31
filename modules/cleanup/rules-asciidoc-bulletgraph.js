var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => BulletGraphLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('BulletGraphLink')
	},
	{
		name: 'build-variables: ApiLinkBase => BulletGraphLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('BulletGraphLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => BulletGraphAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('BulletGraphAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => BulletGraphNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('BulletGraphNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => BulletGraphNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('BulletGraphNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => BulletGraphName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('BulletGraphName')
	},
	{
		name: 'build-variables: ControlsBase => BulletGraphBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('BulletGraphBase')
	},
    {
		name: 'build-variables: ControlsRangeName => BulletGraph',
		pattern: buildVariables.regex('ControlsRangeName'),
		replacement: buildVariables.wrap('BulletGraphRange')
	}
];