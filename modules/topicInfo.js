(function(module){
	
	var parser = require('./parser.js');
	var path = require('path');
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
	
	module.getInfo = function(relativeFilePath, callback){
		
		var returnValue = {
			title: '',
			markup: '',
			controlName: '',
			tags: [],
			docXGuid: '',
			buildFlags: []
		};
		
		parser.parseFile(relativeFilePath, function(error, obj){
			
			if(error){
				callback(error, null);			
			} else {
				returnValue.title = obj.Topic.Title._.trim();
				returnValue.markup = obj.Topic.TopicSections.TopicSection.Content._;
				
				var defs = obj.Topic.PropertyDefinitionValues.PropertyDefinitionValue;
				
				if(_.isArray(defs) && defs.length >= 1){
					returnValue.tags = listToArray(defs[0].PropertyValue._, ',');
				}
				
				if(_.isArray(defs) && defs.length >= 2){
					returnValue.controlName = defs[1].PropertyValue._.trim();
				}
				
				returnValue.docXGuid = path.basename(relativeFilePath, path.extname(relativeFilePath));
				
				returnValue.buildFlags = listToArray(obj.Topic.$.BuildFlags, ',');
				
				callback(null, returnValue);
			}
		});
	};
	
	
}(module.exports));