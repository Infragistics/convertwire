var _ = require('lodash');

module.exports.listToArray = function(listString, delimiter){	
	var list = listString.split(delimiter);
	var val = '';
	list.forEach(function(item, index){
		val = item.trim().replace(/\n/g, '').replace(/\r/g, '');
		list[index] = val;
	});
	
	return _.compact(list);
};

module.exports.getValue = function(element){
	if(typeof element === 'undefined' || element === null) return '';
	return element;
};

module.exports.createHtmlDocument = function(){
	return  {
		fileName: '',
		name: '',
		title: '',
		markup: '',
		controlName: [],
		tags: [],
		docXGuid: '',
		buildFlags: []
	};
};