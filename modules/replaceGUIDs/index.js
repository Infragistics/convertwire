
var sanitize = (value) => {
	return value.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
};

module.exports.replace = function(content, remoteData){
    
    if(typeof content !== 'string') {
        console.log('replaceGuids: ' + content);
        content = ''
    };
	
	var guidMatchExpression = '{?([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})}?';
	var expression = new RegExp(guidMatchExpression, 'ig');
	var guids = content.match(expression);
	
	if(guids){
		guids.forEach(function(guid){
			sanitized = sanitize(guid);
			var regex = new RegExp('\{?'+ sanitized +'\}?', 'ig');
			if(remoteData[guid]){
				content = content.replace(regex, remoteData[guid] + '.html');
			}
		});	
	}
	
	return content;
};