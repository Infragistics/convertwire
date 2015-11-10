describe('cleanup', function(){
	
	var path = require('path');
	var cleanup = require(path.resolve(__dirname, '../../modules/cleanup'));
	
	describe('clean', function(){
		
		it('replaces stray slashes in ordered lists', function(){
			var src = '*1\.*';
			var dest = cleanup.clean(src);
			var expected = '*1.*';
			expect(dest).toEqual(expected);
		});
		
		it('replaces sâ€¦ with ....', function(){
			var src = 'Usersâ€¦';
			var dest = cleanup.clean(src);
			var expected = 'Users...';
			expect(dest).toEqual(expected);
		});
		
		it('replaces â„¢ with &trade;', function(){
			var src = 'xamDataGridâ„¢';
			var dest = cleanup.clean(src);
			var expected = 'xamDataGrid&trade;';
			expect(dest).toEqual(expected);
		});
	});
});