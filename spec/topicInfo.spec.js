/// <reference path="../typings/jasmine/jasmine.d.ts"/>

describe('topicInfo', function(){
	
	var _ = require('lodash');
	var topicInfo = require('../modules/topicInfo.js');
	var config = require('./config.js');
	
	describe('getInfo', function(){
		
		var topics = [];
		
		beforeEach(function(done){	
			if (topics.length === 0) {
				var keys = _.keys(config.topicData);
				keys.forEach(function(key, index){
					var file = config.topicData[key];
					topicInfo.getInfo('../spec/data/' + file.fileName, function(error, topic){
						topics.push(topic);
						if(topics.length === keys.length){
							done();
						}
					});
				});
			} else {
				done();
			}
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