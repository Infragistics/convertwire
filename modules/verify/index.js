module = module.exports;

var _ = require('lodash');

// removed 'summary','param'
var htmlTags = ['!--','!doctype','a','abbr','acronym','','address','applet','','area','article','aside','audio','b','base','basefont','','bdi','bdo','big','','blockquote','body','br','button','canvas','caption','center','','cite','code','col','colgroup','datalist','dd','del','details','dfn','dialog','dir','','div','dl','dt','em','embed','fieldset','figcaption','figure','font','','footer','form','frame','','frameset','','h1 to h6','head','header','hr','html','i','iframe','img','input','ins','kbd','keygen','label','legend','li','link','main','map','mark','menu','menuitem','meta','meter','nav','noframes','','noscript','object','ol','optgroup','option','output','p','pre','progress','q','rp','rt','ruby','s','samp','script','section','select','small','source','span','strike','','strong','style','sub','sup','table','tbody','td','textarea','tfoot','th','thead','time','title','tr','track','tt','','u','ul','var','video','wbr'];

var matchRules = [
	{
		name: 'html',
		pattern: '(<[a-zA-Z]+)',
		message: 'HTML tags'
	},
	{
		name: 'guid',
		pattern: '([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})',
		message: 'GUIDs'
	}
];

module.checkText = (text) => {
		
	var results = { count: 0 };
	
	matchRules.forEach((rule) => { 
		var expression, matches, matchCount;
		
		expression = new RegExp(rule.pattern, 'gi');
		matches = text.match(expression);
		matchCount;
		
		if(rule.name === 'html' && matches){
			var _matches = [];
			
			for(var i=0; i < matches.length; i++){
				matches[i] = matches[i].substr(1);
				
				if(_.contains(htmlTags, matches[i])){
					_matches.push(matches[i]);
				}
			}
			
			matches = _matches;
		}
		
		matchCount = matches ? matches.length : 0;		
		
		results[rule.name] = {
			count: matchCount,
			message: rule.message,
			matches: matches ? matches : []
		};
		results.count += matchCount;
	});
	
	return results;
};

module.checkFolder = (folderPath) => {
	var path = require('path');
	var fs = require('fs');
	
	var totalResults = [];
	
	var basePath = path.resolve(__dirname, folderPath);
	var fileNames = fs.readdirSync(basePath);
	
	fileNames.forEach((fileName) => {
		var filePath = path.join(basePath, fileName);
		var text = fs.readFileSync(filePath, 'utf8');
		var fileResult = module.checkText(text);
		
		if(fileResult.count > 0){
			totalResults.push({
				path: filePath,
				results: fileResult
			});
		}
	});
	
	fs.writeFileSync(path.resolve(__dirname, '../../logs/validation.txt'), JSON.stringify(totalResults),'utf8');
	
	console.log(totalResults.length + ' invalid files');
};

module.checkFolder('../../spec/data/dest');