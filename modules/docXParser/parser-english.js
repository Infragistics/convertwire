(function(module){
	
	'use strict';
	
	const _ = require('lodash');
	const utils = require('./utils.js');

	//	the file path is not used here, but is used in the jp parser and
	//  is included in this module to keep the interface uniform
	module.parse = (obj, filePath, callback) => {
		let markup, htmlDocument;
		
		htmlDocument = utils.createHtmlDocument();
		
		if(!_.isUndefined(obj.Topic.Title) && !_.isUndefined(obj.Topic.Title._)){
			htmlDocument.title = obj.Topic.Title._.trim();
		}
		
		if(!_.isUndefined(obj.Topic.TopicSections.TopicSection.Content._)){
			markup = obj.Topic.TopicSections.TopicSection.Content._;
			markup = markup.replace(/&nbsp;/g, ' ');
			htmlDocument.markup = markup;
		}
		
		var defs = obj.Topic.PropertyDefinitionValues.PropertyDefinitionValue;
		
		if(_.isArray(defs) && defs.length >= 1){
			let tagsList = defs[0].PropertyValue._;
			if(!_.isUndefined(tagsList)) {
				htmlDocument.tags = utils.listToArray(tagsList, ',');
			}
		}
		
		if(_.isArray(defs) && defs.length >= 2){
			let controlName = defs[1].PropertyValue._;
			if(!_.isUndefined(controlName)){
				htmlDocument.controlName = utils.listToArray(controlName.trim(), ',');
			}
		}
		
		if(!_.isUndefined(obj.Topic.$.Id)) {
			htmlDocument.docXGuid = utils.getValue(obj.Topic.$.Id);
		}
		
		if(!_.isUndefined(obj.Topic.$.Name)) {
			htmlDocument.name = utils.getValue(obj.Topic.$.Name);
		}
		
		if(!_.isUndefined(obj.Topic.$.BuildFlags)) {
			htmlDocument.buildFlags = utils.listToArray(obj.Topic.$.BuildFlags, ',');
		}
		
		callback(null, htmlDocument);
		
	};
	
}(module.exports));