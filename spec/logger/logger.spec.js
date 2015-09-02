var path = require('path')
var logger = require(path.resolve(__dirname, '../../modules/logger'));
var dest = __dirname + '\\test-log.csv';
var fs = require('fs');

describe('logger', function(){
	
	it('exists', function(){
		expect(logger).not.toBeNull();
		expect(logger).not.toBeUndefined();
	});
	
	describe('log', function(){
		
		logger.options.dest = dest;
		
		it('exists', function(){
			expect(logger.log).not.toBeUndefined();
		});
		
		it('validates path before attempting to log', function(){
			logger.options.dest = '';
			expect(function(){
				logger.log('test');
			}).toThrow(new Error('Invalid \'options.dest\' path'));
			logger.options.dest = dest;
		});
		
		it('writes message', function(done){
			var message = 'test message';
			
			logger.options.dest = dest;
			
			if(fs.existsSync(dest)){
				fs.unlinkSync(dest);
			}
			
			logger.log(message, null, null, function(err){
				expect(err).toBeNull();
				var contents = fs.readFileSync(dest, {encoding: 'utf8'});
				expect(contents).toContain(message + ',');
				done();
			});
		});
		
		it('writes context', function(done){
			var context;
			
			context = {
				name: 'test name'
			};
			
			logger.options.dest = dest;
			
			if(fs.existsSync(dest)){
				fs.unlinkSync(dest);
			}
			
			logger.log(null, context, null, function(err){
				expect(err).toBeNull();
				var contents = fs.readFileSync(dest, {encoding: 'utf8'});
				expect(contents).toContain(JSON.stringify(context) + ',');
				done();
			});
		});
		
		it('writes tag', function(done){
			var tag;
			
			tag = 'missing-file';
			
			logger.options.dest = dest;
			
			if(fs.existsSync(dest)){
				fs.unlinkSync(dest);
			}
			
			logger.log(null, null, tag, function(err){
				expect(err).toBeNull();
				var contents = fs.readFileSync(dest, {encoding: 'utf8'});
				expect(contents).toContain(tag + ',');
				done();
			});
		});
		
	});
	
	describe('options', function(){
		it('defines destination path', function() {
			expect(logger.options.dest).not.toBeUndefined();
		});
	});
	
});