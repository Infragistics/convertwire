

module.exports.replace = function(content, remoteData){
	
	var guidMatchExpression = '([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})';
	var expression = new RegExp(guidMatchExpression, 'g');
	var guids = content.match(expression);
	
	guids.forEach(function(guid){
		content = content.replace(guid, remoteData[guid] + '.html');
	});
	
	return content;
};