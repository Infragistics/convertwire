var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => DataGridLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('DataGridLink')
	},
	{
		name: 'build-variables: ApiLinkBase => DataGridLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('DataGridLinkBase')
	},
    {
		name: 'build-variables: ApiControlsBase => DataGridLinkBase',
		pattern: buildVariables.regex('ApiControlsBase'),
		replacement: buildVariables.wrap('DataGridLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => DataGridAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('DataGridAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => DataGridNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('DataGridNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => DataGridNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('DataGridNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => DataGridName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('DataGridName')
	},
	{
		name: 'build-variables: ControlsBase => DataGridBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('DataGridBase')
	},
    {
		name: 'build-variables: DVApiLink => DataVizLink',
		pattern: buildVariables.regex('DVApiLink'),
		replacement: buildVariables.wrap('DataVizLink')
	}
];