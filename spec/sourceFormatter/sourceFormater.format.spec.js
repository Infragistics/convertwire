var path = require('path');
var fs = require('fs');

var sourceFormatter = require(path.resolve(__dirname, '../../modules/sourceFormatter'));
 
describe('sourceFormatter', function(){
	
	describe('format', function(){
		
		var stripIds = function(text){
			return text.replace(/id="(.*?)"/g, '');
		};

		it('pulls build flags from parent elements', function(){
			var src = fs.readFileSync(path.resolve(__dirname, './data/flags-from-parent-src.html'), 'utf8');
			var dest = fs.readFileSync(path.resolve(__dirname, './data/flags-from-parent-dest.html'), 'utf8');
			var result = sourceFormatter.format(src);
			//fs.writeFileSync(path.resolve(__dirname, './data/flags-from-parent-dest.html'), result, 'utf8');
			expect(stripIds(result)).toEqual(stripIds(dest));
		});
		
		it('pulls build flags from child elements', function(){
			var src = fs.readFileSync(path.resolve(__dirname, './data/flags-from-children-src.html'), 'utf8');
			var dest = fs.readFileSync(path.resolve(__dirname, './data/flags-from-children-dest.html'), 'utf8');
			var result = sourceFormatter.format(src);
			//fs.writeFileSync(path.resolve(__dirname, './data/flags-from-children-dest.html'), result, 'utf8');
			expect(stripIds(result)).toEqual(stripIds(dest));
		});
		
		it('pulls build flags from PRE element', function(){
			var src = fs.readFileSync(path.resolve(__dirname, './data/flags-from-PRE-src.html'), 'utf8');
			var dest = fs.readFileSync(path.resolve(__dirname, './data/flags-from-PRE-dest.html'), 'utf8');
			var result = sourceFormatter.format(src);
			//fs.writeFileSync(path.resolve(__dirname, './data/flags-from-PRE-dest.html'), result, 'utf8');
			expect(stripIds(result)).toEqual(stripIds(dest));
		});
		
		it('expands build flag groups', function(){
			var src = fs.readFileSync(path.resolve(__dirname, './data/flags-group-src.html'), 'utf8');
			var dest = fs.readFileSync(path.resolve(__dirname, './data/flags-group-dest.html'), 'utf8');
			var result = sourceFormatter.format(src);
			//fs.writeFileSync(path.resolve(__dirname, './data/flags-group-dest.html'), result, 'utf8');
			expect(stripIds(result)).toEqual(stripIds(dest));
		});
		
	});
	
});