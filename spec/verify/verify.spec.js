/*
describe('verify', () => {
	
	var path = require('path');
	var verify = require(path.resolve(__dirname, '../../modules/verify'));
	
	describe('checkText', () => {
		
		it('checks text against each validation rule', () => {
			
			var source = '<a href="http://test.com">0f087027-4cf6-4de5-92f2-ff0ea9383701</a> ' + 
						 '<div class="alert">01e94d58-aefe-4cdb-a050-cb94bedc467b</div> ';
			
			var results = verify.checkText(source);
			
			expect(results.html).toBeDefined();
			expect(results.html.count).toBe(2);
			
			expect(results.guid).toBeDefined();
			expect(results.guid.count).toBe(2);
		});
		
		it('works with no matches', () => {
			
			var results = verify.checkText('<a href="http://test.com">test</a>');
			
			expect(results.html).toBeDefined();
			expect(results.html.count).toBe(1);
			
			expect(results.guid).toBeDefined();
			expect(results.guid.count).toBe(0);
		});
		
	});
});
// */