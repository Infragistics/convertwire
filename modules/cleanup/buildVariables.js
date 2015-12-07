module = module.exports;

module.delimiters = { start: '{', end: '}' };

module.wrap = (variable) => {
	return module.delimiters.start + variable + module.delimiters.end;
};

module.regex = (variable) => {
	var exp = new RegExp(module.wrap(variable)
							.replace(module.delimiters.start, '\\' + module.delimiters.start)
							.replace(module.delimiters.end, '\\' + module.delimiters.end)
						, 'gi');
	return exp;
};