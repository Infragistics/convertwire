/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/jasmine/jasmine.d.ts"/>

describe('docXParser', function(){
	
	var parser = require('../modules/docXParser.js');
	var _ = require('lodash');
	var config = require('./config.js');
	var fs = require('fs');
	var path = require('path');
	var topics = [];
	
	var getTopics = function(){
		beforeEach(function(done){	
			if (topics.length === 0) {
				var keys = _.keys(config.topicData);
				keys.forEach(function(key, index){
					var file = config.topicData[key];
					fs.readFile(path.resolve(__dirname, 'data/' + file.fileName), 'utf8', function(readError, xmlString){
						parser.parse(xmlString, function(error, topic){
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
	
	describe('toHTML', function () {
		getTopics();
		
		it('serializes htmlDocument markup with metadata', function(){
			
			topics.forEach(function(topic, index){
				var testData = config.topicData[topic.docXGuid];
				var html = parser.toHtml(topic);
				
				// check HTML
				expect(html).toContain(testData.markupFragment);
				
				// check metadata
				expect(html).toContain("\"docXGuid\": \"" + testData.docXGuid + "\"");
				expect(html).toContain("\"title\": \"" + testData.title + "\"");
				expect(html).toContain("\"name\": \"" + testData.name + "\"");
			});
			
		});
	});
	
	describe('parse', function(){
		
		getTopics();
		
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
				expect(topic.title).toEqual(testData.title);
			});
		});
		
		it('extracts topic markup', function(){
			topics.forEach(function(topic, index){
				var testData = config.topicData[topic.docXGuid];
				expect(topic.markup).toContain(testData.markupFragment);
			});
		});
		
		it('extracts topic control name', function(){
			topics.forEach(function(topic, index){
				var testData = config.topicData[topic.docXGuid];
				expect(topic.controlName).toEqual(testData.controlName);
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