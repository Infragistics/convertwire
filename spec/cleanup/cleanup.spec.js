describe('cleanup', function(){
	
	var path = require('path');
	var cleanup = require(path.resolve(__dirname, '../../modules/cleanup'));
	var buildVariables = require(path.resolve(__dirname, '../../modules/cleanup/buildVariables.js'));
	
	describe('asciidoc', () => {

		it('supports Japanese file extension for included files', () => {
			var src = `[[_Ref391537902]]
== _xamDiagram_   構成の概要

[[_Ref391537908]]

=== xamDiagram 構成の概要

include::xamdiagram-configuration-summary.adoc[]`;

			var dest = cleanup.asciidoc(src);

			var expected = `[[_Ref391537902]]
== _xamDiagram_   構成の概要

[[_Ref391537908]]

=== xamDiagram 構成の概要

include::xamdiagram-configuration-summary.ja-JP.adoc[]`;

			expect(dest).toEqual(expected);
		});

		it('removes stray note label', () => {
			var src = `The DataPresenter controls allow your end users to filter out records in order to view a smaller subset of the original data. You can expose record filtering functionality to your end users in two different ways -- a filter record or a filter icon in the field headers.

Note:

.Note
[NOTE]
====`;

			var dest = cleanup.asciidoc(src);
			var expected = `The DataPresenter controls allow your end users to filter out records in order to view a smaller subset of the original data. You can expose record filtering functionality to your end users in two different ways -- a filter record or a filter icon in the field headers.

.Note
[NOTE]
====`;
			expect(dest).toEqual(expected);
		});

		it('trims new lines that begin with italics', () => {
			var src = `
 _italic_ words`;

			var dest = cleanup.asciidoc(src);

			var expected = `
_italic_ words`;

			expect(dest).toEqual(expected);
		});
        
        it('wraps telephone mask in pass macro', () => {
			var src = '(###)-###-####';
			var dest = cleanup.asciidoc(src);
			var expected = 'pass:[(###)-###-####]';
			expect(dest).toEqual(expected);
		});

		it('moves title charaters into pick macro', () => {
			var src = `== pick:[sl.wpf="link:test.html[Test]"]`;
			var dest = cleanup.asciidoc(src);
			var expected = `pick:[sl.wpf="== link:test.html[Test]"]`;
			expect(dest).toEqual(expected);
		});
			
		it('replaces stray slashes in ordered lists', () => {
			var src = '*1\.*';
			var dest = cleanup.asciidoc(src);
			var expected = '*1.*';
			expect(dest).toEqual(expected);
		});
		
		it('sets correct order of bold/italic', () => {
			var src = '_*xamDiagram*_';
			var dest = cleanup.asciidoc(src);
			var expected = '*_xamDiagram_*';
			expect(dest).toEqual(expected);
		});
		
		it('bold terms to have only one space after last astrisk', () => {
			var src = '. *Create a shape instance.*There are two ways to do this:';
			var dest = cleanup.asciidoc(src);
			var expected = '. *Create a shape instance.* There are two ways to do this:';
			expect(dest).toEqual(expected);
		});
		
		it('replaces sâ€¦ with ....', () => {
			var src = 'Usersâ€¦';
			var dest = cleanup.asciidoc(src);
			var expected = 'Users...';
			expect(dest).toEqual(expected);
		});
        
        it('fixes include macro file extensions', () => {
            var src = 'include::xamdiagram-user-interactions-configuration-summary-chart.html.adoc[]';
            var dest = cleanup.asciidoc(src);
            var expected = 'include::xamdiagram-user-interactions-configuration-summary-chart.adoc[]';
            expect(dest).toEqual(expected);
        });
		
		it('replaces â„¢ with &trade;', () => {
			var src = 'xamDataGridâ„¢';
			var dest = cleanup.asciidoc(src);
			var expected = 'xamDataGrid&trade;';
			expect(dest).toEqual(expected);
		});
		
		it('replaces build variable delimiters', () => {
			var src = '%%BuildVariable%%';
			var dest = cleanup.asciidoc(src);
			var expected = '{BuildVariable}';
			expect(dest).toEqual(expected);
		});
		
		it('fixes in-document links with extra bolds', () => {
			var src = '* * <<RelatedTopics,Related Topics>>*';
			var dest = cleanup.asciidoc(src);
			var expected = '* <<RelatedTopics,Related Topics>>';
			expect(dest).toEqual(expected);
		});
        
        it('removes spaces in links', () => {
			var src = 'link:{AssemblyName}.Controls.Menus.XamTree.v{ProductVersion}~ Infragistics.Controls.Menus.xamTree~ExpandedIconTemplate.html[ExpandedIconTemplate]';
			var dest = cleanup.asciidoc(src);
			var expected = 'link:{AssemblyName}.Controls.Menus.XamTree.v{ProductVersion}~Infragistics.Controls.Menus.xamTree~ExpandedIconTemplate.html[ExpandedIconTemplate]';
			expect(dest).toEqual(expected);
		});
		
		it('removes extra spaces before a tm', () => {
			var src = '_xamDiagram_  ™';
			var dest = cleanup.asciidoc(src);
			var expected = '_xamDiagram_™';
			expect(dest).toEqual(expected);
		});

		it('removes extra spaces inside a bold words', () => {
			var src = `
* * WinButton*
* * WinCheckEditor*
* * WinCombo*

this is a test of the emergency *broadcast* system

* one
* two
* three`;

			var dest = cleanup.asciidoc(src);
			var expected = `
* *WinButton*
* *WinCheckEditor*
* *WinCombo*

this is a test of the emergency *broadcast* system

* one
* two
* three`;
			expect(dest).toEqual(expected);
		});
		
		it('adds line break when ifdef is first in a row', () => {
			var src = `[options="header", cols="a,a"]
|====
|Sample|Purpose

|ifdef::sl[] 

sl

endif::sl[] 

| cell

|====`;
			var dest = cleanup.asciidoc(src);
			
			var expected = `[options="header", cols="a,a"]
|====
|Sample|Purpose

|
ifdef::sl[] 

sl

endif::sl[] 

| cell

|====`;
			
			expect(dest).toEqual(expected);
		});
		
		it('reformats malformed Related Topics', () => {
			var src = `== 

*Related Topics*`;

			var dest = cleanup.asciidoc(src);
			
			var expected = '== Related Topics\n\n';
			expect(dest).toEqual(expected);
		});
		
		it('reformats malformed Related Topics', () => {
			var src = `<temp-token role="list:start">* *label1* - detail1

+ more info1

<temp-token role="list:start">* *label2* - detail2

+ more info2`;

			var dest = cleanup.asciidoc(src);
			
			var expected = `* *label1* - detail1

+

more info1

* *label2* - detail2

+

more info2`;
			expect(dest).toEqual(expected);
		});
		
		it('adds passthrough tokens for lines that start with .NET', () => {
			var src = `// first line
| .NET Framework
|.NET Framework
.NET Framework
The .NET Framework
craigshoemaker.net`;

			var dest = cleanup.asciidoc(src);
			
			var expected = `// first line
| $$.NET$$ Framework
|$$.NET$$ Framework
$$.NET$$ Framework
The .NET Framework
craigshoemaker.net`;

			expect(dest).toEqual(expected);
		});
		
		it('adds line break to headers when there is not one', () => {
			var src = `Text
== Header`;

			var dest = cleanup.asciidoc(src);
			
			var expected = `Text

== Header`;

			expect(dest).toEqual(expected);
		});
		
		it('reformats malformed Related Topics some more', () => {
			var src = `Figure SEQ Figure 2: DataSlicer with the header area Expanded.Related Topics

== Related Topics

== Related Topic

this is a test Related Topic`;

			var dest = cleanup.asciidoc(src);
			
			var expected = `Figure SEQ Figure 2: DataSlicer with the header area Expanded.

== Related Topics

== Related Topics

== Related Topic

this is a test 

== Related Topic
`;

			expect(dest).toEqual(expected);
		});
		
		it('reformats malformed Related Topics', () => {
			var src = `[start=1]

. 

Create a Calendar layout with the xamDockManager control.


[start=1]

. 

*Create a Calendar layout with the xamDockManager control.*

[start=1]

. 

_Create a Calendar layout with the xamDockManager control._`;

			var dest = cleanup.asciidoc(src);
			
			var expected = `[start=1]
. Create a Calendar layout with the xamDockManager control.

[start=1]
. *Create a Calendar layout with the xamDockManager control.*

[start=1]
. _Create a Calendar layout with the xamDockManager control._`;
			expect(dest).toEqual(expected);
		});
		
		it('reorders anchor tokens over list start tokens', () => {
			var src = `[start=1]
. 

[[step1]]
Step 1`;

			var dest = cleanup.asciidoc(src);
			
			var expected = `[[step1]]
[start=1]
. Step 1`;

			expect(dest).toEqual(expected);
		});
		
		it('build variable: ProductNameShort => ProductName', () => {
			var src = buildVariables.wrap('ProductNameShort');;
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('ProductName');;
			expect(dest).toEqual(expected);
		});
		
		it('build variable: ControlsNameRange => ControlsRangeName', () => {
			var src = buildVariables.wrap('ControlsNameRange');;
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('ControlsRangeName');;
			expect(dest).toEqual(expected);
		});
		
		it('build variable: AssemblyVersion => ApiVersion', () => {
			var src = buildVariables.wrap('AssemblyVersion');;
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('ApiVersion');;
			expect(dest).toEqual(expected);
		});
		
		it('build variable: AssemblyPlatform => ApiLink', () => {
			var src = buildVariables.wrap('AssemblyPlatform');
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('ApiPlatform');
			expect(dest).toEqual(expected);
		});
		
		it('build variable: ProductAssemblyName => AssemblyName', () => {
			var src = buildVariables.wrap('ProductAssemblyName');
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('ApiPlatform');
			expect(dest).toEqual(expected);
		});
		
		it('build variable: ProductPlatform => AssemblyName', () => {
			var src = buildVariables.wrap('ProductPlatform');
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('AssemblyName');
			expect(dest).toEqual(expected);
		});
		
		it('build variable: ProductVersionCondensed => ProductVersion', () => {
			var src = buildVariables.wrap('ProductVersionCondensed');
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('ProductVersion');
			expect(dest).toEqual(expected);
		});
		
		it('build variable: ProductVersionFull => ProductVersion', () => {
			var src = buildVariables.wrap('ProductVersionFull');
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('ProductVersion');
			expect(dest).toEqual(expected);
		});
		
		it('build variable: ProductVersionShort => ProductVersion', () => {
			var src = buildVariables.wrap('ProductVersionShort');
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('ProductVersion');
			expect(dest).toEqual(expected);
		});
		
		it('build variable: ProductVersionNumber => ProductVersion', () => {
			var src = buildVariables.wrap('ProductVersionNumber');
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('ProductVersion');
			expect(dest).toEqual(expected);
		});
		
		it('build variable: VsVersion => PlatformIDE', () => {
			var src = buildVariables.wrap('VsVersion');
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('PlatformIDE');
			expect(dest).toEqual(expected);
		});
		
		it('build variable: XpSdkInstallPath => InstallPathXP', () => {
			var src = buildVariables.wrap('XpSdkInstallPath');
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('InstallPathXP');
			expect(dest).toEqual(expected);
		});
		
		it('build variable: XpSdkInstallPath => InstallPathXP', () => {
			var src = buildVariables.wrap('VistaSdkInstallPath');
			var dest = cleanup.asciidoc(src);
			var expected = buildVariables.wrap('InstallPathVista');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: ApiLink => DataChartLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'DataChart');
			var expected = buildVariables.wrap('DataChartLink');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: ApiLink => DataChartLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'DataChart');
			var expected = buildVariables.wrap('DataChartLink');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: ApiControlsBase => DataChartLinkBase', () => {
			var src = buildVariables.wrap('ApiControlsBase');
			var dest = cleanup.asciidoc(src, 'DataChart');
			var expected = buildVariables.wrap('DataChartLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: ApiLinkBase => DataChartLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'DataChart');
			var expected = buildVariables.wrap('DataChartLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: AssemblyName => DataChartAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'DataChart');
			var expected = buildVariables.wrap('DataChartAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: ControlsNamespace => DataChartNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'DataChart');
			var expected = buildVariables.wrap('DataChartNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: ControlsNamespaceBase => DataChartNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'DataChart');
			var expected = buildVariables.wrap('DataChartNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: ControlsName => DataChartName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'DataChart');
			var expected = buildVariables.wrap('DataChartName');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: ControlsName => DataChartName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'DataChart');
			var expected = buildVariables.wrap('DataChartName');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: ControlsBase => DataChartBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'DataChart');
			var expected = buildVariables.wrap('DataChartBase');
			expect(dest).toEqual(expected);
		});
		
		// ----- ASPNET -------------
		it('DataChart build variable: OldSamplesUrl => SamplesURL', () => {
			var src = buildVariables.wrap('OldSamplesUrl');
			var dest = cleanup.asciidoc(src, 'ASPNET');
			var expected = buildVariables.wrap('SamplesURL');
			expect(dest).toEqual(expected);
		});
		
		it('DataChart build variable: jQueryApiUrl => jQueryApiLink', () => {
			var src = buildVariables.wrap('jQueryApiUrl');
			var dest = cleanup.asciidoc(src, 'ASPNET');
			var expected = buildVariables.wrap('jQueryApiLink');
			expect(dest).toEqual(expected);
		});
		//
		
		// ----- DataGrid -------------
		it('DataGrid build variable: ApiLink => DataGridLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'DataGrid');
			var expected = buildVariables.wrap('DataGridLink');
			expect(dest).toEqual(expected);
		});
		
		it('DataGrid build variable: ApiLink => DataGridLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'DataGrid');
			var expected = buildVariables.wrap('DataGridLink');
			expect(dest).toEqual(expected);
		});
		
		it('DataGrid build variable: ApiLinkBase => DataGridLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'DataGrid');
			var expected = buildVariables.wrap('DataGridLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('DataGrid build variable: AssemblyName => DataGridAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'DataGrid');
			var expected = buildVariables.wrap('DataGridAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('DataGrid build variable: ControlsNamespace => DataGridNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'DataGrid');
			var expected = buildVariables.wrap('DataGridNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('DataGrid build variable: ControlsNamespaceBase => DataGridNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'DataGrid');
			var expected = buildVariables.wrap('DataGridNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('DataGrid build variable: ControlsName => DataGridName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'DataGrid');
			var expected = buildVariables.wrap('DataGridName');
			expect(dest).toEqual(expected);
		});
		
		it('DataGrid build variable: ControlsName => DataGridName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'DataGrid');
			var expected = buildVariables.wrap('DataGridName');
			expect(dest).toEqual(expected);
		});
		
		it('DataGrid build variable: ControlsBase => DataGridBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'DataGrid');
			var expected = buildVariables.wrap('DataGridBase');
			expect(dest).toEqual(expected);
		});

		it('DataGrid build variable: DVApiLink => DataVizLink', () => {
			var src = buildVariables.wrap('DVApiLink');
			var dest = cleanup.asciidoc(src, 'DataGrid');
			var expected = buildVariables.wrap('DataVizLink');
			expect(dest).toEqual(expected);
		});
		// ----------------------------
		
		// ----- SurfaceChart -------------
		it('SurfaceChart build variable: ApiLink => SurfaceChartLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'SurfaceChart');
			var expected = buildVariables.wrap('SurfaceChartLink');
			expect(dest).toEqual(expected);
		});
		
		it('SurfaceChart build variable: ApiLink => SurfaceChartLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'SurfaceChart');
			var expected = buildVariables.wrap('SurfaceChartLink');
			expect(dest).toEqual(expected);
		});
		
		it('SurfaceChart build variable: ApiLinkBase => SurfaceChartLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'SurfaceChart');
			var expected = buildVariables.wrap('SurfaceChartLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('SurfaceChart build variable: AssemblyName => SurfaceChartAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'SurfaceChart');
			var expected = buildVariables.wrap('SurfaceChartAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('SurfaceChart build variable: ControlsNamespace => SurfaceChartNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'SurfaceChart');
			var expected = buildVariables.wrap('SurfaceChartNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('SurfaceChart build variable: ControlsNamespaceBase => SurfaceChartNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'SurfaceChart');
			var expected = buildVariables.wrap('SurfaceChartNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('SurfaceChart build variable: ControlsName => SurfaceChartName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'SurfaceChart');
			var expected = buildVariables.wrap('SurfaceChartName');
			expect(dest).toEqual(expected);
		});
		
		it('SurfaceChart build variable: ControlsName => SurfaceChartName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'SurfaceChart');
			var expected = buildVariables.wrap('SurfaceChartName');
			expect(dest).toEqual(expected);
		});
		
		it('SurfaceChart build variable: ControlsBase => SurfaceChartBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'SurfaceChart');
			var expected = buildVariables.wrap('SurfaceChartBase');
			expect(dest).toEqual(expected);
		});
		// ----------------------------
		
		// ----- DoughnutChart -------------
		it('DoughnutChart build variable: ApiLink => DoughnutChartLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'DoughnutChart');
			var expected = buildVariables.wrap('DoughnutChartLink');
			expect(dest).toEqual(expected);
		});
		
		it('DoughnutChart build variable: ApiLink => DoughnutChartLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'DoughnutChart');
			var expected = buildVariables.wrap('DoughnutChartLink');
			expect(dest).toEqual(expected);
		});
		
		it('DoughnutChart build variable: ApiLinkBase => DoughnutChartLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'DoughnutChart');
			var expected = buildVariables.wrap('DoughnutChartLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('DoughnutChart build variable: AssemblyName => DoughnutChartAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'DoughnutChart');
			var expected = buildVariables.wrap('DoughnutChartAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('DoughnutChart build variable: ControlsNamespace => DoughnutChartNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'DoughnutChart');
			var expected = buildVariables.wrap('DoughnutChartNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('DoughnutChart build variable: ControlsNamespaceBase => DoughnutChartNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'DoughnutChart');
			var expected = buildVariables.wrap('DoughnutChartNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('DoughnutChart build variable: ControlsName => DoughnutChartName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'DoughnutChart');
			var expected = buildVariables.wrap('DoughnutChartName');
			expect(dest).toEqual(expected);
		});
		
		it('DoughnutChart build variable: ControlsName => DoughnutChartName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'DoughnutChart');
			var expected = buildVariables.wrap('DoughnutChartName');
			expect(dest).toEqual(expected);
		});
		
		it('DoughnutChart build variable: ControlsBase => DoughnutChartBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'DoughnutChart');
			var expected = buildVariables.wrap('DoughnutChartBase');
			expect(dest).toEqual(expected);
		});
		// ----------------------------
		
		// ----- FunnelChart -------------
		it('FunnelChart build variable: ApiLink => FunnelChartLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'FunnelChart');
			var expected = buildVariables.wrap('FunnelChartLink');
			expect(dest).toEqual(expected);
		});
		
		it('FunnelChart build variable: ApiLink => FunnelChartLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'FunnelChart');
			var expected = buildVariables.wrap('FunnelChartLink');
			expect(dest).toEqual(expected);
		});
		
		it('FunnelChart build variable: ApiLinkBase => FunnelChartLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'FunnelChart');
			var expected = buildVariables.wrap('FunnelChartLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('FunnelChart build variable: AssemblyName => FunnelChartAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'FunnelChart');
			var expected = buildVariables.wrap('FunnelChartAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('FunnelChart build variable: ControlsNamespace => FunnelChartNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'FunnelChart');
			var expected = buildVariables.wrap('FunnelChartNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('FunnelChart build variable: ControlsNamespaceBase => FunnelChartNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'FunnelChart');
			var expected = buildVariables.wrap('FunnelChartNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('FunnelChart build variable: ControlsName => FunnelChartName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'FunnelChart');
			var expected = buildVariables.wrap('FunnelChartName');
			expect(dest).toEqual(expected);
		});
		
		it('FunnelChart build variable: ControlsName => FunnelChartName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'FunnelChart');
			var expected = buildVariables.wrap('FunnelChartName');
			expect(dest).toEqual(expected);
		});
		
		it('FunnelChart build variable: ControlsBase => FunnelChartBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'FunnelChart');
			var expected = buildVariables.wrap('FunnelChartBase');
			expect(dest).toEqual(expected);
		});
		// ----------------------------
		
		// ----- PieChart -------------
		it('PieChart build variable: ApiLink => PieChartLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'PieChart');
			var expected = buildVariables.wrap('PieChartLink');
			expect(dest).toEqual(expected);
		});
		
		it('PieChart build variable: ApiLink => PieChartLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'PieChart');
			var expected = buildVariables.wrap('PieChartLink');
			expect(dest).toEqual(expected);
		});
		
		it('PieChart build variable: ApiLinkBase => PieChartLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'PieChart');
			var expected = buildVariables.wrap('PieChartLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('PieChart build variable: AssemblyName => PieChartAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'PieChart');
			var expected = buildVariables.wrap('PieChartAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('PieChart build variable: ControlsNamespace => PieChartNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'PieChart');
			var expected = buildVariables.wrap('PieChartNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('PieChart build variable: ControlsNamespaceBase => PieChartNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'PieChart');
			var expected = buildVariables.wrap('PieChartNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('PieChart build variable: ControlsName => PieChartName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'PieChart');
			var expected = buildVariables.wrap('PieChartName');
			expect(dest).toEqual(expected);
		});
		
		it('PieChart build variable: ControlsName => PieChartName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'PieChart');
			var expected = buildVariables.wrap('PieChartName');
			expect(dest).toEqual(expected);
		});
		
		it('PieChart build variable: ControlsBase => PieChartBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'PieChart');
			var expected = buildVariables.wrap('PieChartBase');
			expect(dest).toEqual(expected);
		});
		// ----------------------------
		
		// ----- Barcodes -------------
		it('Barcodes build variable: ApiLink => BarcodesLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'Barcodes');
			var expected = buildVariables.wrap('BarcodesLink');
			expect(dest).toEqual(expected);
		});
		
		it('Barcodes build variable: ApiLink => BarcodesLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'Barcodes');
			var expected = buildVariables.wrap('BarcodesLink');
			expect(dest).toEqual(expected);
		});
		
		it('Barcodes build variable: ApiLinkBase => BarcodesLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'Barcodes');
			var expected = buildVariables.wrap('BarcodesLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('Barcodes build variable: AssemblyName => BarcodesAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'Barcodes');
			var expected = buildVariables.wrap('BarcodesAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('Barcodes build variable: ControlsNamespace => BarcodesNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'Barcodes');
			var expected = buildVariables.wrap('BarcodesNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('Barcodes build variable: ControlsNamespaceBase => BarcodesNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'Barcodes');
			var expected = buildVariables.wrap('BarcodesNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('Barcodes build variable: ControlsName => BarcodesName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'Barcodes');
			var expected = buildVariables.wrap('BarcodesName');
			expect(dest).toEqual(expected);
		});
		
		it('Barcodes build variable: ControlsName => BarcodesName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'Barcodes');
			var expected = buildVariables.wrap('BarcodesName');
			expect(dest).toEqual(expected);
		});
		
		it('Barcodes build variable: ControlsBase => BarcodesBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'Barcodes');
			var expected = buildVariables.wrap('BarcodesBase');
			expect(dest).toEqual(expected);
		});
		
		it('Barcodes build variable: ControlsQRBarcode => BarcodeQR', () => {
			var src = buildVariables.wrap('ControlsQRBarcode');
			var dest = cleanup.asciidoc(src, 'Barcodes');
			var expected = buildVariables.wrap('BarcodeQR');
			expect(dest).toEqual(expected);
		});
		// ----------------------------
		
		// ----- Spreadsheet -------------
		it('Spreadsheet build variable: ApiLink => SpreadsheetLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'Spreadsheet');
			var expected = buildVariables.wrap('SpreadsheetLink');
			expect(dest).toEqual(expected);
		});
		
		it('Spreadsheet build variable: ApiLink => SpreadsheetLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'Spreadsheet');
			var expected = buildVariables.wrap('SpreadsheetLink');
			expect(dest).toEqual(expected);
		});
		
		it('Spreadsheet build variable: ApiLinkBase => SpreadsheetLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'Spreadsheet');
			var expected = buildVariables.wrap('SpreadsheetLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('Spreadsheet build variable: AssemblyName => SpreadsheetAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'Spreadsheet');
			var expected = buildVariables.wrap('SpreadsheetAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('Spreadsheet build variable: ControlsNamespace => SpreadsheetNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'Spreadsheet');
			var expected = buildVariables.wrap('SpreadsheetNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('Spreadsheet build variable: ControlsNamespaceBase => SpreadsheetNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'Spreadsheet');
			var expected = buildVariables.wrap('SpreadsheetNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('Spreadsheet build variable: ControlsName => SpreadsheetName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'Spreadsheet');
			var expected = buildVariables.wrap('SpreadsheetName');
			expect(dest).toEqual(expected);
		});
		
		it('Spreadsheet build variable: ControlsName => SpreadsheetName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'Spreadsheet');
			var expected = buildVariables.wrap('SpreadsheetName');
			expect(dest).toEqual(expected);
		});
		
		it('Spreadsheet build variable: ControlsBase => SpreadsheetBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'Spreadsheet');
			var expected = buildVariables.wrap('SpreadsheetBase');
			expect(dest).toEqual(expected);
		});
		// ----------------------------
		
		// ----- BulletGraph -------------
		it('BulletGraph build variable: ApiLink => BulletGraphLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'BulletGraph');
			var expected = buildVariables.wrap('BulletGraphLink');
			expect(dest).toEqual(expected);
		});
		
		it('BulletGraph build variable: ControlsRangeName => BulletGraphRange', () => {
			var src = buildVariables.wrap('ControlsRangeName');
			var dest = cleanup.asciidoc(src, 'BulletGraph');
			var expected = buildVariables.wrap('BulletGraphRange');
			expect(dest).toEqual(expected);
		});
		
		it('BulletGraph build variable: ApiLink => BulletGraphLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'BulletGraph');
			var expected = buildVariables.wrap('BulletGraphLink');
			expect(dest).toEqual(expected);
		});
		
		it('BulletGraph build variable: ApiLinkBase => BulletGraphLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'BulletGraph');
			var expected = buildVariables.wrap('BulletGraphLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('BulletGraph build variable: AssemblyName => BulletGraphAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'BulletGraph');
			var expected = buildVariables.wrap('BulletGraphAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('BulletGraph build variable: ControlsNamespace => BulletGraphNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'BulletGraph');
			var expected = buildVariables.wrap('BulletGraphNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('BulletGraph build variable: ControlsNamespaceBase => BulletGraphNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'BulletGraph');
			var expected = buildVariables.wrap('BulletGraphNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('BulletGraph build variable: ControlsName => BulletGraphName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'BulletGraph');
			var expected = buildVariables.wrap('BulletGraphName');
			expect(dest).toEqual(expected);
		});
		
		it('BulletGraph build variable: ControlsName => BulletGraphName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'BulletGraph');
			var expected = buildVariables.wrap('BulletGraphName');
			expect(dest).toEqual(expected);
		});
		
		it('BulletGraph build variable: ControlsBase => BulletGraphBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'BulletGraph');
			var expected = buildVariables.wrap('BulletGraphBase');
			expect(dest).toEqual(expected);
		});
		// ----------------------------

		// ----- LinearGauge -------------
		it('LinearGauge build variable: ApiLink => LinearGaugeLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'LinearGauge');
			var expected = buildVariables.wrap('LinearGaugeLink');
			expect(dest).toEqual(expected);
		});
		
		it('LinearGauge build variable: ControlsRangeName => LinearGaugeRange', () => {
			var src = buildVariables.wrap('ControlsRangeName');
			var dest = cleanup.asciidoc(src, 'LinearGauge');
			var expected = buildVariables.wrap('LinearGaugeRange');
			expect(dest).toEqual(expected);
		});
		
		it('LinearGauge build variable: ApiLink => LinearGaugeLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'LinearGauge');
			var expected = buildVariables.wrap('LinearGaugeLink');
			expect(dest).toEqual(expected);
		});
		
		it('LinearGauge build variable: ApiLinkBase => LinearGaugeLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'LinearGauge');
			var expected = buildVariables.wrap('LinearGaugeLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('LinearGauge build variable: AssemblyName => LinearGaugeAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'LinearGauge');
			var expected = buildVariables.wrap('LinearGaugeAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('LinearGauge build variable: ControlsNamespace => LinearGaugeNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'LinearGauge');
			var expected = buildVariables.wrap('LinearGaugeNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('LinearGauge build variable: ControlsNamespaceBase => LinearGaugeNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'LinearGauge');
			var expected = buildVariables.wrap('LinearGaugeNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('LinearGauge build variable: ControlsName => LinearGaugeName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'LinearGauge');
			var expected = buildVariables.wrap('LinearGaugeName');
			expect(dest).toEqual(expected);
		});
		
		it('LinearGauge build variable: ControlsName => LinearGaugeName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'LinearGauge');
			var expected = buildVariables.wrap('LinearGaugeName');
			expect(dest).toEqual(expected);
		});
		
		it('LinearGauge build variable: ControlsBase => LinearGaugeBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'LinearGauge');
			var expected = buildVariables.wrap('LinearGaugeBase');
			expect(dest).toEqual(expected);
		});
		// ----------------------------
		
		// ----- RadialGauge -------------
		it('RadialGauge build variable: ApiLink => RadialGaugeLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeLink');
			expect(dest).toEqual(expected);
		});
		
		it('RadialGauge build variable: ControlsRangeName => RadialGaugeRange', () => {
			var src = buildVariables.wrap('ControlsRangeName');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeRange');
			expect(dest).toEqual(expected);
		});
		
		it('RadialGauge build variable: ApiLink => RadialGaugeLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeLink');
			expect(dest).toEqual(expected);
		});
		
		it('RadialGauge build variable: ApiLinkBase => RadialGaugeLinkBase', () => {
			var src = buildVariables.wrap('ApiLinkBase');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeLinkBase');
			expect(dest).toEqual(expected);
		});
		
		it('RadialGauge build variable: AssemblyName => RadialGaugeAssembly', () => {
			var src = buildVariables.wrap('AssemblyName');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeAssembly');
			expect(dest).toEqual(expected);
		});
		
		it('RadialGauge build variable: ControlsNamespace => RadialGaugeNamespace', () => {
			var src = buildVariables.wrap('ControlsNamespace');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeNamespace');
			expect(dest).toEqual(expected);
		});
		
		it('RadialGauge build variable: ControlsNamespaceBase => RadialGaugeNamespaceBase', () => {
			var src = buildVariables.wrap('ControlsNamespaceBase');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeNamespaceBase');
			expect(dest).toEqual(expected);
		});
		
		it('RadialGauge build variable: ControlsName => RadialGaugeName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeName');
			expect(dest).toEqual(expected);
		});
		
		it('RadialGauge build variable: ControlsName => RadialGaugeName', () => {
			var src = buildVariables.wrap('ControlsName');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeName');
			expect(dest).toEqual(expected);
		});
		
		it('RadialGauge build variable: ControlsBase => RadialGaugeBase', () => {
			var src = buildVariables.wrap('ControlsBase');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeBase');
			expect(dest).toEqual(expected);
		});
		// ----------------------------
	});
	
	describe('html', () => {

		it('removes-extra-note-label-english', () => {
			var src = `<h1 id="ig-document-title">About Record Filtering</h1> 
<p>The DataPresenter controls allow your end users to filter out records in order to view a smaller subset of the original data. You can expose record filtering functionality to your end users in two different ways -- a filter record or a filter icon in the field headers.</p>
<p style="FONT-WEIGHT: bold">Note:</p>
<div class="ig-note">The filter record and filter icons are not available for the xamDataCarousel&#x2122; control. However, you can add filter conditions to xamDataCarousel in XAML or in procedural code to filter your data. </div>`;

			var dest = cleanup.html(src);

			var expected = `<h1 id="ig-document-title">About Record Filtering</h1> 
<p>The DataPresenter controls allow your end users to filter out records in order to view a smaller subset of the original data. You can expose record filtering functionality to your end users in two different ways -- a filter record or a filter icon in the field headers.</p>
<div class="ig-note">The filter record and filter icons are not available for the xamDataCarousel&#x2122; control. However, you can add filter conditions to xamDataCarousel in XAML or in procedural code to filter your data. </div>`;

			expect(dest).toEqual(expected);
		});
		
		it('replaces style="display:none" with nothing', () => {
			var src = '<div style="display:none">test</div>';
			var dest = cleanup.html(src);
			var expected = '<div>test</div>';
			expect(dest).toEqual(expected);
		});
		
		it('removes innovasys widget XML namespace block', () => {
			var src = `
<TABLE class=ig-layout>
<TBODY>
<TR><TD>  <?xml:namespace prefix = "innovasys" ns = "http://www.innovasys.com/widgets" /><innovasys:widget layout="block" type="Include Topic"><innovasys:widgetproperty layout="block" name="source">5fb1d26d-e938-446d-8c40-2d3ce05eae4b</innovasys:widgetproperty> </innovasys:widget></TD></TR>
</TBODY></TABLE>`;

			var dest = cleanup.html(src);
			
			var expected = `
<TABLE class=ig-layout>
<TBODY>
<TR><TD>  <innovasys:widget layout="block" type="Include Topic"><innovasys:widgetproperty layout="block" name="source">5fb1d26d-e938-446d-8c40-2d3ce05eae4b</innovasys:widgetproperty> </innovasys:widget></TD></TR>
</TBODY></TABLE>`;

			expect(dest).toEqual(expected);
		});

		it('removes autoupdate style attribute', () => {
			var src = `
<div id="docX-root">
<H1><A href="ffd7c9ee-5103-4a99-9ce8-7ba27104a275" style="auto-update-caption: true">Getting Started with Infragistics Control Persistence Framework</A></H1>
<div>
`;

			var dest = cleanup.html(src);

			var expected = `
<div id="docX-root">
<H1><A href="ffd7c9ee-5103-4a99-9ce8-7ba27104a275" >Getting Started with Infragistics Control Persistence Framework</A></H1>
<div>
`;

			expect(dest).toEqual(expected);
		});
		
		it('replaces style="display:none"; with nothing', () => {
			var src = '<div style="display:none;">test</div>';
			var dest = cleanup.html(src);
			var expected = '<div>test</div>';
			expect(dest).toEqual(expected);
		});
		
		it('replaces style="display:block"; with nothing', () => {
			var src = '<div style="display:block;">test</div>';
			var dest = cleanup.html(src);
			var expected = '<div>test</div>';
			expect(dest).toEqual(expected);
		});
		
		it('replaces &#xA0; with &nbsp;', () => {
			var src = '<div>&#xA0;</div>';
			var dest = cleanup.html(src);
			var expected = '<div>&nbsp;</div>';
			expect(dest).toEqual(expected);
		});
		
		it('preserves in-document anchors', () => {
			var src = '<div><a id="yep"></a> Yep</div>';
			var dest = cleanup.html(src);
			var expected = '<div><a id="yep"><span class="temporary">{temp:content}</span></a> Yep</div>';
			expect(dest).toEqual(expected);
		});
        
        it('handles special charaters in replace string', () => {
            var src = '<a name="?_FindReplace_(by_specifying"?></a>';
			var dest = cleanup.html(src);
			var expected = '<a name="_FindReplace_(by_specifying"></a>';
			expect(dest).toEqual(expected);
        });
		
		it('replaces xam_xf_ex with xaml-xf-ex', () => {
			var src = '<DIV id=Example_XAML class=LanguageSpecific style="hs-build-flags: XAM_XF_EX">' + 
					  '<DIV id=Example_XAML class=LanguageSpecific style="hs-build-flags: XAM_XF_EX">';
					  
			var dest = cleanup.html(src);
			
			var expected = '<DIV id=Example_XAML class=LanguageSpecific style="hs-build-flags: xaml-xf-ex">' +
						   '<DIV id=Example_XAML class=LanguageSpecific style="hs-build-flags: xaml-xf-ex">';
						   
			expect(dest).toEqual(expected);
		});
		
		it('replaces droid_ex with android-ex', () => {
			var src = '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: DROID_EX">' + 
					  '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: DROID_EX">';
					  
			var dest = cleanup.html(src);
			
			var expected = '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: wpf,win-forms,xamarin">' +
						   '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: wpf,win-forms,xamarin">';
						   
			expect(dest).toEqual(expected);
		});
		
		it('replaces WinForms with win-forms', () => {
			
			var src = 
`This topic demonstrates creating WinForms  
This topic demonstrates creating WinForms, and such
style="hs-build-flags: SL,WPF,WPF,WINFORMS"
style="hs-build-flags: SL,WPF,WINFORMS,ANDRIOD"
style="hs-build-flags: WINFORMS"
style="hs-build-flags: WinForms"
style="hs-build-flags: WinForms, SL"`;
					  
			var dest = cleanup.html(src);
			
			var expected = 
`This topic demonstrates creating WinForms  
This topic demonstrates creating WinForms, and such
style="hs-build-flags: SL,WPF,WPF,win-forms"
style="hs-build-flags: SL,WPF,win-forms,ANDRIOD"
style="hs-build-flags: win-forms"
style="hs-build-flags: win-forms"
style="hs-build-flags: win-forms, SL"`;
						   
			expect(dest).toEqual(expected);
		});

		it('escapes-operator-characters-in-text-only', () => {
			var src = `
you have to use the *, <=, ->, <- operators

<code>
i * j;
i &lt;= j;
i <= j;
i -&gt; j;
i -> j;
i &lt;- j;
i <- j;
</code>

<pre>
i * j;
i &lt;= j;
i <= j;
i -&gt; j;
i -> j;
i &lt;- j;
i <- j;
</pre>
`;

			var dest = cleanup.html(src);

			var expected = `
you have to use the $$*$$, $$<=$$, $$->$$, $$<-$$ operators

<code>
i * j;
i <= j;
i <= j;
i -> j;
i -> j;
i <- j;
i <- j;
</code>

<pre>
i * j;
i <= j;
i <= j;
i -> j;
i -> j;
i <- j;
i <- j;
</pre>
`;

			expect(dest).toEqual(expected);
		});
		
		it('replaces winphone with win-phone', () => {
			var src = '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: WinPhone">' + 
					  '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: WINPHONE">';
					  
			var dest = cleanup.html(src);
			
			var expected = '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: win-phone">' +
						   '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: win-phone">';
						   
			expect(dest).toEqual(expected);
		});
		
		it('replaces winrt with win-rt', () => {
			var src = '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: WINRT">' + 
					  '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: WinRT">';
					  
			var dest = cleanup.html(src);
			
			var expected = '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: win-rt">' +
						   '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: win-rt">';
						   
			expect(dest).toEqual(expected);
		});
        
        it('empty elements with {temp:empty-element}', () => {
			var src = '<td><p> </p></td><a></a>';
			var dest = cleanup.html(src);
			var expected = '<td>{temp:empty-cell}</td>{temp:empty-element}';
						   
			expect(dest).toEqual(expected);
		});
	});
});