(function(module){
	
	var _ = require('lodash');

	module.parse = function(obj, htmlDocument, getValue, listToArray){
		var markup;
		
		if(!_.isUndefined(obj.Topic.Title) && !_.isUndefined(obj.Topic.Title._)){
			htmlDocument.title = obj.Topic.Title._.trim();
		}
		
		if(!_.isUndefined(obj.Topic.TopicSections.TopicSection.Content._)){
			markup = obj.Topic.TopicSections.TopicSection.Content._;
			markup = markup.replace(/&nbsp;/, ' ');
			htmlDocument.markup = markup;
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
		
		return htmlDocument;
		
	};
	
}(module.exports));