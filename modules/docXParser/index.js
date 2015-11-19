
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
			
			var buildFlags = arrayToString(htmlDocument.buildFlags);
			buildFlags = buildFlags
								.replace('A33F8D9D-1A93-4A02-85E3-FC849DE1B8EA', 'WINFORMS')
								.replace('34ADE70F-C190-412D-A2CE-25D1E1AE0FF8', 'WINRT')
								.replace('{673B143B-6568-4204-99C0-4548E4AFEF3C}', 'WPF')
								.replace('18DC7F35-922E-46A9-9127-9FA472AE43E2', 'ANDROID')
								.replace('DROID_IN', 'ANDROID')
								.replace('{A72AF817-CD06-4101-A8ED-A0E52FC4DD05}', 'SL')
								.replace('27968E2C-EB4E-49F9-9A03-2FF58C6428F6', 'WINPHONE');
			
			var metaData = 
				"<pre id='metadata'>\n" +
"|metadata|\n" +
"{\n" +
"    \"name\": \"" + htmlDocument.name.toLowerCase().replace(/_/g,'-') + "\",\n" +
"    \"title\": \"" + htmlDocument.title + "\",\n" +
"    \"controlName\": [" + arrayToString(htmlDocument.controlName) + "],\n" +
"    \"tags\": [" + arrayToString(htmlDocument.tags) + "],\n" +
"    \"guid\": \"" + htmlDocument.docXGuid.replace(/-/g, '`') + "\",\n" + // transform so later regex (that replaces guids) will not affect this value 
"    \"buildFlags\": [" + buildFlags + "]\n" +
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