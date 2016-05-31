module = module.exports;

var sanitize = (value) => {
	return value.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
};

module.delimiters = { start: '{', end: '}' };

module.guidRegex = (guid) => {
	guid = sanitize(guid);
	return new RegExp(`\{?${guid}\}?`, 'gi');
};

module.wrap = (variable) => {
	return module.delimiters.start + variable + module.delimiters.end;
};

module.regex = (variable) => {
	variable = sanitize(variable);
	var exp = new RegExp(module.wrap(variable), 'gi');
	return exp;
};