describe('cleanup', function(){
	
	var path = require('path');
	var cleanup = require(path.resolve(__dirname, '../../modules/cleanup'));
	var buildVariables = require(path.resolve(__dirname, '../../modules/cleanup/buildVariables.js'));
	var delimiters = buildVariables.delimiters;
	
	describe('asciidoc', () => {
			
		it('replaces stray slashes in ordered lists', () => {
			var src = '*1\.*';
			var dest = cleanup.asciidoc(src);
			var expected = '*1.*';
			expect(dest).toEqual(expected);
		});
		
		it('replaces sâ€¦ with ....', () => {
			var src = 'Usersâ€¦';
			var dest = cleanup.asciidoc(src);
			var expected = 'Users...';
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
		
		it('build variable: AssemblyPlatform => ApiLink', () => {
			var src = '%%AssemblyPlatform%%';
			var dest = cleanup.asciidoc(src);
			var expected = delimiters.start + 'ApiLink' + delimiters.end;
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
		
				// ----- RadialGauge -------------
		it('RadialGauge build variable: ApiLink => RadialGaugeLink', () => {
			var src = buildVariables.wrap('ApiLink');
			var dest = cleanup.asciidoc(src, 'RadialGauge');
			var expected = buildVariables.wrap('RadialGaugeLink');
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
		
		it('replaces style="display:none" with nothing', () => {
			var src = '<div style="display:none">test</div>';
			var dest = cleanup.html(src);
			var expected = '<div>test</div>';
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
			var expected = '<div><a id="yep"><span class="temporary">temp content</span></a> Yep</div>';
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
			
			var expected = '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: android-ex">' +
						   '<DIV id=Example_VB class=LanguageSpecific style="hs-build-flags: android-ex">';
						   
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
	});
});