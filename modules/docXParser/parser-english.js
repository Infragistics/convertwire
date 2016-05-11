(function(module){
	
	'use strict'
	
	const _ = require('lodash');
	const utils = require('./utils.js');

	//	the file path is not used here, but is used in the jp parser and
	//  is included in this module to keep the interface uniform
	module.parse = (obj, filePath, callback) => {
		let markup, htmlDocument;
		
		htmlDocument = utils.createHtmlDocument();
		
		if(!_.isUndefined(obj.Topic.Title) && !_.isUndefined(obj.Topic.Title._)){
			htmlDocument.title = obj.Topic.Title._.trim();
		} else if(!_.isUndefined(obj.Topic.Title) && obj.Topic.Title.length > 0) {
			htmlDocument.title = obj.Topic.Title;
		} else if(!_.isUndefined(obj.Topic.$.Name) && obj.Topic.$.Name.length > 0){
			htmlDocument.title = obj.Topic.$.Name.replace(/_/g, ' ');
		}
			
		if(!_.isUndefined(obj.Topic.TopicSections.TopicSection.Content._)){
			markup = obj.Topic.TopicSections.TopicSection.Content._;
			markup = markup.replace(/&nbsp;/g, ' ');
			htmlDocument.markup = markup;
		}
		
		let defs = obj.Topic.PropertyDefinitionValues.PropertyDefinitionValue;
			
		if(_.isArray(defs)) {
			let isExtraContent = (value) => {
                if(!_.isString(value)) {
                    console.log('isExtraContent: ' + value);
                    value = '';
                };
                
				let match = value.indexOf('<') > -1 || value.length > 100;
				if(!match){
					let count = value.match(/ /g);
					match = (count && count.length > 4);
				}
				return match;
			};
			
			let isTags = (def, i) => {
				let match = false;
				let targetIndex = defs.length === 3? 1 : 0;
				match = !isExtraContent(def) && i === targetIndex;
				return match;
			};
			
			let isControlName = (def, i) => {
				let match = false;
				let targetIndex = defs.length === 3? 2 : 1;				
				match = !isExtraContent(def) && i === targetIndex;
				return match;
			};
			
			defs.forEach((def, i) => {
				let value = def.PropertyValue._;
				value = !_.isUndefined(value)? value.trim() : ''; 
				if (isTags(value, i)){
					htmlDocument.tags = utils.listToArray(value, ',');
				} else if (isControlName(value, i)){
					htmlDocument.controlName = utils.listToArray(value, ',');
				}
			});
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
		
		if(!_.isUndefined(obj.Topic.$.CreatedOn)){
			htmlDocument.createdOn = utils.getValue(obj.Topic.$.CreatedOn);
		}
		
		if(!_.isUndefined(obj.Topic.$.ModifiedOn)){
			htmlDocument.modifiedOn = utils.getValue(obj.Topic.$.ModifiedOn);
		}
		
		callback(null, htmlDocument);
		
	};
	
}(module.exports));