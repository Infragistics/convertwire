describe('cleanup', function(){
	
	var path = require('path');
	var cleanup = require(path.resolve(__dirname, '../../modules/cleanup'));
	
	describe('asciidoc', function(){
		
		it('replaces stray slashes in ordered lists', function(){
			var src = '*1\.*';
			var dest = cleanup.asciidoc(src);
			var expected = '*1.*';
			expect(dest).toEqual(expected);
		});
		
		it('replaces sâ€¦ with ....', function(){
			var src = 'Usersâ€¦';
			var dest = cleanup.asciidoc(src);
			var expected = 'Users...';
			expect(dest).toEqual(expected);
		});
		
		it('replaces â„¢ with &trade;', function(){
			var src = 'xamDataGridâ„¢';
			var dest = cleanup.asciidoc(src);
			var expected = 'xamDataGrid&trade;';
			expect(dest).toEqual(expected);
		});
	});
	
	describe('html', function(){
		
		it('replaces style="display:none" with nothing', function(){
			var src = '<div style="display:none" style="hs-build-flags: WINFORMS">test</div>';
			var dest = cleanup.html(src);
			var expected = '<div style="hs-build-flags: WINFORMS">test</div>';
			expect(dest).toEqual(expected);
		});
		
		it('replaces style="display:none"; with nothing', function(){
			var src = '<div style="display:none;" style="hs-build-flags: WINFORMS">test</div>';
			var dest = cleanup.html(src);
			var expected = '<div style="hs-build-flags: WINFORMS">test</div>';
			expect(dest).toEqual(expected);
		});
		
		it('replaces style="display:block"; with nothing', function(){
			var src = '<div style="display:block;" style="hs-build-flags: WINFORMS">test</div>';
			var dest = cleanup.html(src);
			var expected = '<div style="hs-build-flags: WINFORMS">test</div>';
			expect(dest).toEqual(expected);
		});
		
	});
});