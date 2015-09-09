(function(module){
	
	var _ = require('lodash');
	var fs = require('fs');
	var path = require('path')
	var utils = require('./utils.js')
	var enParser = require('./parser-english.js');
	var xml2js = require('xml2js');
	var parser = new xml2js.Parser({
		explicitArray: false
	});

	module.parse = function(xmlObj, filePath, callback) {
		var file, englishXML, htmlDocument, jpFileNameExpression;
		
		htmlDocument = utils.createHtmlDocument();
		
		jpFileNameExpression = /.ja-JP/;
		
		file = {
			en: {
				fileName: path.basename(filePath).replace(jpFileNameExpression, ''),
				fullPath: filePath.replace(jpFileNameExpression, '')
			},
			jp: {
				fileName: path.basename(filePath),
				fullPath: filePath
			}
		};
		
		englishXML = fs.readFileSync(file.en.fullPath, 'utf8');
		
		parser.parseString(englishXML, function(error, obj){
			enParser.parse(obj, filePath, function(parseError, englishHtmlDocument){
				htmlDocument = englishHtmlDocument;
				
				var jpXML = fs.readFileSync(file.jp.fullPath, 'utf8');
				
				parser.parseString(jpXML, function(jpParseError, jpObj){
					
					if(!_.isUndefined(jpObj.topic.title) && !_.isUndefined(jpObj.topic.title._)){
						htmlDocument.title = jpObj.topic.title._.trim();
					}
					
					if(!_.isUndefined(jpObj.topic.topicsection)){
						htmlDocument.markup = jpObj.topic.topicsection._;
					}
					
					callback(error, htmlDocument);
				});
			});
		});
		
		/*
		if(!_.isUndefined(obj.Topic.Title) && !_.isUndefined(obj.Topic.Title._)){
			htmlDocument.title = obj.Topic.Title._.trim();
		}
		
		
		
		var defs = obj.Topic.PropertyDefinitionValues.PropertyDefinitionValue;
		
		if(_.isArray(defs) && defs.length >= 1){
			var tagsList = defs[0].PropertyValue._;
			if(!_.isUndefined(tagsList)) {
				htmlDocument.tags = listToArray(tagsList, ',');
			}
		}
		
		if(_.isArray(defs) && defs.length >= 2){
			var controlName = defs[1].PropertyValue._;
			if(!_.isUndefined(controlName)){
				htmlDocument.controlName = controlName.trim();
			}
		}
		
		if(!_.isUndefined(obj.Topic.$.Id)) {
			htmlDocument.docXGuid = getValue(obj.Topic.$.Id);
		}
		
		if(!_.isUndefined(obj.Topic.$.Name)) {
			htmlDocument.name = getValue(obj.Topic.$.Name);
		}
		
		if(!_.isUndefined(obj.Topic.$.BuildFlags)) {
			htmlDocument.buildFlags = listToArray(obj.Topic.$.BuildFlags, ',');
		}
		*/
		
	};
	
}(module.exports));