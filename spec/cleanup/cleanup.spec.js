describe('cleanup', function(){
	
	var path = require('path');
	var cleanup = require(path.resolve(__dirname, '../../modules/cleanup'));
	
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
	});
	
	describe('html', () => {
		
		it('replaces style="display:none" with nothing', () => {
			var src = '<div style="display:none" style="hs-build-flags: WINFORMS">test</div>';
			var dest = cleanup.html(src);
			var expected = '<div style="hs-build-flags: WINFORMS">test</div>';
			expect(dest).toEqual(expected);
		});
		
		it('replaces style="display:none"; with nothing', () => {
			var src = '<div style="display:none;" style="hs-build-flags: WINFORMS">test</div>';
			var dest = cleanup.html(src);
			var expected = '<div style="hs-build-flags: WINFORMS">test</div>';
			expect(dest).toEqual(expected);
		});
		
		it('replaces style="display:block"; with nothing', () => {
			var src = '<div style="display:block;" style="hs-build-flags: WINFORMS">test</div>';
			var dest = cleanup.html(src);
			var expected = '<div style="hs-build-flags: WINFORMS">test</div>';
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
		
		it('removes empty HTML tags', () => {
			
		});
	});
});