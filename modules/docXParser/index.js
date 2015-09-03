
(function(module){
	
	var xml2js = require('xml2js');
	var parser = new xml2js.Parser({
		explicitArray: false
	});
	
	var _ = require('lodash');
	var path = require('path');
	
	var english = require('./parser-english.js');
	var japanese = require('./parser-japanese.js');
	
	var listToArray = function(listString, delimiter){
		
		var list = listString.split(delimiter);
		var val = '';
		list.forEach(function(item, index){
			val = item.trim().replace(/\n/g, '').replace(/\r/g, '');
			list[index] = val;
		});
		
		return _.compact(list);
	};
	
	module.toHtml = function(htmlDocument){
			var htmlString = '<div id="docX-root">\n\n'
			+ '<h1 id="ig-document-title">' + htmlDocument.title + '</h1>\n\n' 
			+ htmlDocument.markup + '\n</div>';
			
			var arrayToString = function(array){
				if(array.length === 0) return '';
				return "\"" + array.join("\",\"") + "\""; 
			};
			
			var metaData = 
				"<pre id='metadata'>\n" +
"|metadata|\n" +
"{\n" +
"    \"name\": \"" + htmlDocument.name + "\",\n" +
"    \"controlName\": \"" + htmlDocument.controlName + "\",\n" +
"    \"tags\": [" + arrayToString(htmlDocument.tags) + "],\n" +
"    \"docXGuid\": \"" + htmlDocument.docXGuid + "\",\n" +
"    \"title\": \"" + htmlDocument.title + "\",\n" +
"    \"buildFlags\": [" + arrayToString(htmlDocument.buildFlags) + "]\n" +
"}\n" +
"|metadata|\n" +
"</pre>";

			return metaData + "\n\n" + htmlString;
	};
	
	module.parse = function(xmlString, filePath, callback) {
		
		var htmlDocument = {
			fileName: '',
			name: '',
			title: '',
			markup: '',
			controlName: '',
			tags: [],
			docXGuid: '',
			buildFlags: []
		};
		
		parser.parseString(xmlString, function(error, obj){
			var parser = null, errorMessage;
			
			var getValue = function(element){
				if(typeof element === 'undefined' || element === null) return '';
				return element;
			};
			
			var isEnglishTopic = function(obj){
				return obj.hasOwnProperty('Topic') && obj.Topic.$.Id.length > 0;
			};
			
			var isJapaneseTopic = function(){
				return obj.hasOwnProperty('topic');
			};
			
			if(error){
				callback(error, null);			
			} else {

				if(isJapaneseTopic(obj)) {
					parser = japanese;
				} else if (isEnglishTopic(obj)){
					parser = english;
				} else {
					errorMessage = 'Not an English or Japanese topic';
					callback(errorMessage, null);
				}
				
				if(parser !== null){
					htmlDocument = parser.parse(obj, htmlDocument, getValue, listToArray);				
					callback(null, htmlDocument);
				}
			}
			
		});
	};
	
	
}(module.exports));