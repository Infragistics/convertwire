
(function(module){
	
	var xml2js = require('xml2js');
	var parser = new xml2js.Parser({
		explicitArray: false
	});
	
	var _ = require('lodash');
	
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
	
	module.parse = function(xmlString, callback) {
		
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
			
			var getValue = function(element){
				if(typeof element === 'undefined' || element === null) return '';
				return element;
			};
			
			if(error){
				callback(error, null);			
			} else {
				
				var parser = english;
				
				/*
				if(obj.hasOwnProperty('topic')) {
					parser = japanese;
				} else if (obj.hasOwnProperty('Topic')){
					parser = english;
				} else {
					throw new DOMException('xml data does not look like it\'s a valid English or Japanese DocumentX file');
				}
				*/
				
				htmlDocument = parser.parse(obj, htmlDocument, getValue, listToArray);				
				callback(null, htmlDocument);
			}
			
		});
	};
	
	
}(module.exports));