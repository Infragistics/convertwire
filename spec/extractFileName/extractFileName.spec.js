var path = require('path');

describe('extractFileName', function(){
	var extractFileName = require(path.resolve(__dirname, '../../modules/extractFileName'));
	
	describe('read', function(){
		var value = extractFileName.read('../../spec/data/dest');
		
		var documents = value.documents;
		var duplicates = value.duplicates;
		
		it('has no duplicates', function(){
			expect(Object.keys(duplicates).length).toEqual(0);
		});
		
		it('has documents', function(){
			expect(Object.keys(documents).length).toBeGreaterThan(1);
		});
		
	});
});