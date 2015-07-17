
(function(module){
	
	var xml2js = require('xml2js');
	var parser = new xml2js.Parser({
		explicitArray: false
	});
	
	var _ = require('lodash');
	
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
			var htmlString = '<div id="docX-root">\n' + htmlDocument.markup + '\n</div>';
			
			var arrayToString = function(array){
				if(array.length === 0) return '';
				return "\"" + array.join("\",\"") + "\""; 
			};
			
			var metaData = 
				"<!--\n" +
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
"-->";

			return htmlString + "\n\n" + metaData;
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
				
				if(!_.isUndefined(obj.Topic.Title) && !_.isUndefined(obj.Topic.Title._)){
					htmlDocument.title = obj.Topic.Title._.trim();
				}
				
				if(!_.isUndefined(obj.Topic.TopicSections.TopicSection.Content._)){
					htmlDocument.markup = obj.Topic.TopicSections.TopicSection.Content._;
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
				
				callback(null, htmlDocument);
			}
			
		});
	};
	
	
}(module.exports));