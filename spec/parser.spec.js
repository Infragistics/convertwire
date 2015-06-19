/// <reference path="../typings/jasmine/jasmine.d.ts"/>

describe('parser', function(){
	
	var parser = require('../modules/parser.js');
	var config = require('./config.js');
	var relativeFilePath = '../spec/data/' + config.topicData['01e94d58-aefe-4cdb-a050-cb94bedc467b'].fileName;
	var path = require('path');
	
	it('is loaded', function(){
		expect(parser).not.toBe(null);
	});
	
	describe('read', function(){
		it('returns contents of XML document', function(done){
			parser.read(relativeFilePath, function(error, contents){
				expect(contents.length).toBeGreaterThan(0);
				done();
			});
		});
		
		it('returns custom error message if file does not exist', function(done){
			var fileName = '../content/blah.xml';
			var fullPath = path.join(__dirname, fileName);
			parser.read(fileName, function(error, contents){
				var msg = error.message;
				expect(msg).toEqual(fullPath + ' does not exist');
				expect(contents).toBeNull();
				done();
			});
		});
	});
	
	describe('parse', function(){
		
		var xml = '<people>' + 
					'<person><firstName>Craig</firstName><lastName>Shoemaker</lastName></person>' +
					'<person firstName="Heidi" lastName="Shoemaker"></person>' + 
				  '</people>';
				  
		it('result to be an object', function(done){			
			parser.parse(xml, function(error, obj){
				expect(obj).not.toBeNull();
				expect(obj).toBeDefined();
				done();
			});
		});
		
		it('parses nested elements', function(done){
			parser.parse(xml, function(error, obj){
				var craig = obj.people.person[0];
				expect(craig.firstName).toEqual('Craig');
				done();
			});
		});
		
		it('parses element attributes', function(done){
			parser.parse(xml, function(error, obj){
				var heidi = obj.people.person[1].$;
				expect(heidi.firstName).toEqual('Heidi');
				done();
			});
		});
		
	});
	
	describe('parseFile', function(){
		
		it('returns an error if given bad file path', function(done){
			parser.parseFile('blah.xml', function(error, obj){
				expect(error).toBeDefined();
				expect(obj).toBeNull();
				done();
			});
		});
		
		it('parses file from file path', function(done){
			parser.parseFile(relativeFilePath, function(error, obj){
				var title = obj.Topic.Title._;
				expect(title).toEqual('Creating Custom Series');
				done();
			});	
		});
	});
});