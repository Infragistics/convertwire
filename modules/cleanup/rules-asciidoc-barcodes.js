var buildVariables = require('./buildVariables.js');

module.exports.regex = [
	{
		name: 'build-variables: ApiLink => BarcodesLink',
		pattern: buildVariables.regex('ApiLink'),
		replacement: buildVariables.wrap('BarcodesLink')
	},
	{
		name: 'build-variables: ApiLinkBase => BarcodesLinkBase',
		pattern: buildVariables.regex('ApiLinkBase'),
		replacement: buildVariables.wrap('BarcodesLinkBase')
	},
	{
		name: 'build-variables: AssemblyName => BarcodesAssembly',
		pattern: buildVariables.regex('AssemblyName'),
		replacement: buildVariables.wrap('BarcodesAssembly')
	},
	{
		name: 'build-variables: ControlsNamespace => BarcodesNamespace',
		pattern: buildVariables.regex('ControlsNamespace'),
		replacement: buildVariables.wrap('BarcodesNamespace')
	},
	{
		name: 'build-variables: ControlsNamespaceBase => BarcodesNamespaceBase',
		pattern: buildVariables.regex('ControlsNamespaceBase'),
		replacement: buildVariables.wrap('BarcodesNamespaceBase')
	},
	{
		name: 'build-variables: ControlsName => BarcodesName',
		pattern: buildVariables.regex('ControlsName'),
		replacement: buildVariables.wrap('BarcodesName')
	},
	{
		name: 'build-variables: ControlsBase => BarcodesBase',
		pattern: buildVariables.regex('ControlsBase'),
		replacement: buildVariables.wrap('BarcodesBase')
	},
    {
		name: 'build-variables: ControlsQRBarcode => BarcodeQR',
		pattern: buildVariables.regex('ControlsQRBarcode'),
		replacement: buildVariables.wrap('BarcodeQR')
	},
    {
		name: 'build-variables: Controls128Barcode => Barcode128',
		pattern: buildVariables.regex('Controls128Barcode'),
		replacement: buildVariables.wrap('Barcode128')
	}
];