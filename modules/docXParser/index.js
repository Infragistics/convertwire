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
			
			// transform GUID so later regex (that replaces guids) will not affect this value
			let metaData = 
`<pre id='metadata'>
|metadata|
{
    "name": "${htmlDocument.name.toLowerCase().replace(/_/g,'-')}",
    "controlName": [${arrayToString(htmlDocument.controlName)}],
    "tags": [${arrayToString(htmlDocument.tags)}],
    "guid": "${htmlDocument.docXGuid.replace(/-/g, '`')}",  
    "buildFlags": [${arrayToString(htmlDocument.buildFlags)}],
	"createdOn": "${htmlDocument.createdOn}",
	"modifiedOn": "${htmlDocument.modifiedOn}"
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