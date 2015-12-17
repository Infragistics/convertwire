

module.exports.replace = function(content, remoteData){
	
	var guidMatchExpression = '{?([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})}?';
	var expression = new RegExp(guidMatchExpression, 'ig');
	var guids = content.match(expression);
	
	if(guids){
		guids.forEach(function(guid){
			guid = guid.replace(/(\{|\})/g, '');
			var regex = new RegExp('\{?'+ guid +'\}?', 'ig');
			if(remoteData[guid]){
				content = content.replace(regex, remoteData[guid] + '.html');
			}
		});	
	}
	
	return content;
};