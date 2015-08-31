var module = module.exports;

module.removeExtraLineBreaks = function(value){
	var multipleLineBreakExpression = /\n\n{2,}/g;
	var firstLineBreakOnlyExpression = /\n/;
	value = value.replace(multipleLineBreakExpression, '\n\n');
	value = value.replace(firstLineBreakOnlyExpression, '');
	return value;
};