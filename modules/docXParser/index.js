
(function(module){
	
	var xml2js = require('xml2js');
	var parser = new xml2js.Parser({
		explicitArray: false
	});
		
	var english = require('./parser-english.js');
	var japanese = require('./parser-japanese.js');
	
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
"    \"name\": \"" + htmlDocument.name.toLowerCase().replace(/_/g,'-') + "\",\n" +
"    \"controlName\": [" + arrayToString(htmlDocument.controlName) + "],\n" +
"    \"tags\": [" + arrayToString(htmlDocument.tags) + "],\n" +
"    \"docXGuid\": \"" + htmlDocument.docXGuid.replace(/-/g, '`') + "\",\n" + // transform so later regex (that replaces guids) will not affect this value 
"    \"title\": \"" + htmlDocument.title + "\",\n" +
"    \"buildFlags\": [" + arrayToString(htmlDocument.buildFlags) + "]\n" +
"}\n" +
"|metadata|\n" +
"</pre>";

			return metaData + "\n\n" + htmlString;
	};
	
	module.parse = function(xmlString, filePath, callback) {
		
		parser.parseString(xmlString, function(error, obj){
			var langParser = null, parseError;
			
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
					langParser = japanese;
				} else if (isEnglishTopic(obj)){
					langParser = english;
				} else {
					parseError = {
						message: 'Not an English or Japanese topic',
						filePath: filePath,
						tag: 'format'
					};
					callback(parseError, null);
				}
				
				if(langParser !== null){
					langParser.parse(obj, filePath, callback);
				}
			}
			
		});
	};
	
	
}(module.exports));