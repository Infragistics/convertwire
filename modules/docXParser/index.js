(function(module){
	
	'use strict';
	
	const xml2js = require('xml2js');
	const parser = new xml2js.Parser({
		explicitArray: false
	});
		
	const english = require('./parser-english.js');
	const japanese = require('./parser-japanese.js');
	
	module.toHtml = (htmlDocument) => {
			let htmlString = 
`<div id="docX-root">
<h1 id="ig-document-title">${htmlDocument.title}</h1> 
${htmlDocument.markup}</div>`;
			
			let arrayToString = function(array){
				if(array.length === 0) {
					return '';
				};
				return "\"" + array.join("\",\"") + "\""; 
			};
			
			let buildFlags = arrayToString(htmlDocument.buildFlags);
			buildFlags = buildFlags
								.replace('A33F8D9D-1A93-4A02-85E3-FC849DE1B8EA', 'winforms')
								.replace('34ADE70F-C190-412D-A2CE-25D1E1AE0FF8', 'winrt')
								.replace('{673B143B-6568-4204-99C0-4548E4AFEF3C}', 'wpf')
								.replace('18DC7F35-922E-46A9-9127-9FA472AE43E2', 'android')
								.replace('DROID_IN', 'android')
								.replace('{A72AF817-CD06-4101-A8ED-A0E52FC4DD05}', 'sl')
								.replace('27968E2C-EB4E-49F9-9A03-2FF58C6428F6', 'winphone');
			
			// transform so later regex (that replaces guids) will not affect this value
			let metaData = 
`<pre id='metadata'>
|metadata|
{
    "name": "${htmlDocument.name.toLowerCase().replace(/_/g,'-')}",
    "title": "${htmlDocument.title}",
    "controlName": [${arrayToString(htmlDocument.controlName)}],
    "tags": [${arrayToString(htmlDocument.tags)}],
    "guid": "${htmlDocument.docXGuid.replace(/-/g, '`')}",  
    "buildFlags": [${buildFlags}]
}
|metadata|
</pre>`;

			return metaData + "\n\n" + htmlString;
	};
	
	module.parse = (xmlString, filePath, callback) => {
		
		parser.parseString(xmlString, (error, obj) => {
			let langParser = null, parseError;
			
			let isEnglishTopic = (obj) => {
				return obj.hasOwnProperty('Topic') && obj.Topic.$.Id.length > 0;
			};
			
			let isJapaneseTopic = () => {
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
				
				if(langParser){
					langParser.parse(obj, filePath, callback);
				}
			}
			
		});
	};
	
}(module.exports));