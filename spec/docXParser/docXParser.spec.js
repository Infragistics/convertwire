/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

describe('docXParser', function(){
	
	var parser = require('../../modules/docXParser');
	var _ = require('lodash');
	var config = require('./config.js');
	var fs = require('fs');
	var path = require('path');
	var topics = [];
	var jpTopics = [];
	
	var getTopics = function(){
		beforeEach(function(done){	
			if (topics.length === 0) {
				var keys = _.keys(config.topicData);
				keys.forEach(function(key, index){
					var file = config.topicData[key];
					var filePath = path.resolve(__dirname, 'data/' + file.fileName);
					fs.readFile(filePath, 'utf8', function(readError, xmlString){
						parser.parse(xmlString, filePath, function(error, topic){
							topics.push(topic);
							if(topics.length === keys.length){
								done();
							}
						});
					});
				});
			} else {
				done();
			}
		});
	};
	
	var getJPTopics = function(){
		beforeEach(function(done){
			if(jpTopics.length === 0){
				var keys = _.keys(config.topicData);
				keys.forEach(function(key, index){
					var file = config.topicData[key];
					var filePath = path.resolve(__dirname, 'data/' + file.fileNameJP);
					fs.readFile(filePath, 'utf8', function(readError, xmlString){
						parser.parse(xmlString, filePath, function(error, topic){
							jpTopics.push(topic);
							if(jpTopics.length === keys.length){
								done();
							}
						});
					});
				});
			} else {
				done();
			}
		});
	};
	
	describe('Japanese:', function(){
		describe('parse', function(){
			getJPTopics();
			
			it('extracts topic markup', function(){
				jpTopics.forEach(function(topic, index){
					var testData = config.topicData[topic.docXGuid];
					expect(topic.markup).toContain(testData.markupFragment.jp);
				});
			});
			
			it('extracts topic title', function(){
				jpTopics.forEach(function(topic, index){
					var testData = config.topicData[topic.docXGuid];
					expect(topic.title).toContain(testData.title.jp);
				});
			});
			
		});
	});
	
	describe('English:', function(){
		
		describe('toHTML', function () {
			getTopics();
			
			it('serializes htmlDocument markup with metadata', function(){
				
				topics.forEach(function(topic, index){
					var testData = config.topicData[topic.docXGuid];
					var html = parser.toHtml(topic);
					
					// check HTML
					expect(html).toContain(testData.markupFragment.en);
					
					// check metadata
					expect(html).toContain('"guid": "' + testData.docXGuid.replace(/-/g, '`') + '"');
					expect(html).toContain('"name": "' + testData.name.toLowerCase().replace(/_/g, '-') + '"');
				});
				
			});
		});
		
		describe('parse', function(){
			
			getTopics();
			
			it('returns error for bad file', function(){
				
				parser.parse('<badFile></badFile>', 'c:\bad-file.xml', function(error, topic){
					expect(error).not.toBeNull();
					expect(topic).toBeNull();
				});
				
			});
			
			it('extracts DocumentX name', function(){
				topics.forEach(function(topic, index){
					var testData = config.topicData[topic.docXGuid];
					expect(topic.name).toEqual(testData.name);
				});
			});
			
			it('extracts DocumentX GUID', function(){
				topics.forEach(function(topic, index){
					var testData = config.topicData[topic.docXGuid];
					expect(topic.docXGuid).toEqual(testData.docXGuid);
				});
			});
			
			it('extracts topic name', function(){
				topics.forEach(function(topic, index){
					var testData = config.topicData[topic.docXGuid];
					expect(topic.title).toEqual(testData.title.en);
				});
			});
			
			it('extracts topic markup', function(){
				topics.forEach(function(topic, index){
					var testData = config.topicData[topic.docXGuid];
					expect(topic.markup).toContain(testData.markupFragment.en);
				});
			});
			
			it('extracts topic control name', function(){
				topics.forEach(function(topic, index){
					var testData = config.topicData[topic.docXGuid];
					var areEqual = _.isEqual(topic.controlName, testData.controlName);
					if(!areEqual){
						console.log('-----');
						console.log(topic.controlName);
						console.log(testData.controlName);
						console.log('-----');
					}
					expect(areEqual).toBe(true);
				});
			});
			
			it('extracts topic tags', function(){
				topics.forEach(function(topic, index){
					var testData = config.topicData[topic.docXGuid];
					var areEqual = _.isEqual(topic.tags, testData.tags);
					expect(areEqual).toBe(true);
				});		
			});
			
			it('extracts build flags', function(){
				topics.forEach(function(topic, index){
					var testData = config.topicData[topic.docXGuid];
					var areEqual = _.isEqual(topic.buildFlags, testData.buildFlags);
					expect(areEqual).toBe(true);
				});			
			});
			
		});
	});
	
});