var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => SpreadsheetLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('SpreadsheetLink')
	},
	{
		name: 'build-variables: ApiLinkBase => SpreadsheetLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('SpreadsheetLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => SpreadsheetAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('SpreadsheetAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => SpreadsheetNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('SpreadsheetNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => SpreadsheetNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('SpreadsheetNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => SpreadsheetName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('SpreadsheetName')
	},
	{
		name: 'build-variables: ControlsBase => SpreadsheetBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('SpreadsheetBase')
	}
];