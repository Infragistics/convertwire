module = module.exports;

var _ = require('lodash');

// removed 'summary','param'
var htmlTags = ['!--','!doctype','a','abbr','acronym','','address','applet','','area','article','aside','audio','b','base','basefont','','bdi','bdo','big','','blockquote','body','br','button','canvas','caption','center','','cite','code','col','colgroup','datalist','dd','del','details','dfn','dialog','dir','','div','dl','dt','em','embed','fieldset','figcaption','figure','font','','footer','form','frame','','frameset','','h1 to h6','head','header','hr','html','i','iframe','img','input','ins','kbd','keygen','label','legend','li','link','main','map','mark','menu','menuitem','meta','meter','nav','noframes','','noscript','object','ol','optgroup','option','output','p','pre','progress','q','rp','rt','ruby','s','samp','script','section','select','small','source','span','strike','','strong','style','sub','sup','table','tbody','td','textarea','tfoot','th','thead','time','title','tr','track','tt','','u','ul','var','video','wbr'];

var matchRules = [
	{
		name: 'raw-guid',
		pattern: /link:([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})/gi,
		message: 'raw GUIDs',
		description: 'There are links that were not resolved from the GUIDs to file names.',
		expectedOccurence: 1
	},
	{
		name: 'bad-link-replacement',
		pattern: /undefined\.html/gi,
		message: 'bad link replacement',
		description: 'A GUID was not located when attempting to find a file name.',
		expectedOccurence: 0
	}
];

module.checkText = (text) => {
		
	var results = {
		items: []
	};
	
	matchRules.forEach((rule) => { 
		
		var 
			result = {name: null, count:0}, 
			count = 0,
			matches = null,
			tag = null,
			matchedText = [];
		
		matches = text.match(rule.pattern);
		
		if(matches && (matches.length > rule.expectedOccurence)){
			if(rule.name === 'empty-html'){
				matches.forEach((match) => {
					tag = match.replace('<', '');
					if(_.contains(htmlTags, tag)){
						count++;
						matchedText.push(tag);
					}
				});
			} else {
				count = matches.length;
				matchedText = matchedText.concat(matches);
			}
			matchedText = _.unique(matchedText);
		}
		
		if(count > 0){
			result.name = rule.name;
			result.count = count;
			result.matches = matchedText;
			results.items.push(result);
		}
	});
	
	return results;
};

module.checkFolder = (folderPath) => {
	var path = require('path');
	var fs = require('fs');
	
	var totalResults = [];
	var final = [];
	
	var basePath = path.resolve(__dirname, folderPath);
	var fileNames = fs.readdirSync(basePath);
	
	fileNames.forEach((fileName) => {
		if(!/(html|no-format)/.test(fileName)){
			var filePath = path.join(basePath, fileName);
			var text = fs.readFileSync(filePath, 'utf8');
			var fileResults = module.checkText(text);
			
			if(fileResults.items.length > 0){
				fileResults.name = fileName;
				totalResults.push(fileResults);
			}
		}
	});
	
	final.push('=====================================================');
	final.push(` ${totalResults.length} files failed validation`)
	final.push('=====================================================');
	final.push('');
	
	totalResults.forEach((result) => {
		final.push(result.name);
		result.items.forEach((item) => {
			final.push(`  - ${item.name}: ${item.count - 1}`);
			if(item.matches){
				item.matches.forEach((match, i) => {
					if(item.name === 'raw-guid'){
						if(i > 0){
							final.push(`    ${ match.replace('link:', '') }`);
						}
					} else {
						final.push(`    ${match}`);
					}
				});
			}
		});
		final.push('');
	});
	
	if(totalResults.length > 0){
		var finalText = final.join('\n');
		
		fs.writeFileSync(path.resolve(__dirname, '../../logs/validation.txt'), finalText,'utf8');
		
		console.log(totalResults.length + ' invalid files');
	}
};

module.checkFolder('../../spec/data/dest');