describe('replaceGUIDs', function(){
	
	var path = require('path');
	var svc = require(path.resolve(__dirname, '../../modules/replaceGUIDs'));
	
	var remoteData = {
		'f774a2ab-6b55-40b8-b5e9-ab54ce1e83ff': 'title-one',
		'f83a3bf1-9b81-47c8-b743-cdbc714df506': 'title-two',
		'f90d204a-c226-4e44-9593-f9e4b7fdd98c': 'title-three'
	};
	
	var content = '= Introduction\n\n' + 
				  'This is a test of the emergency broadcast link:f774a2ab-6b55-40b8-b5e9-ab54ce1e83ff[system].\n\n' +
				  '== Related Topics\n\n' +
				  '. link:f774a2ab-6b55-40b8-b5e9-ab54ce1e83ff[Title One]\n' +
				  '. link:f83a3bf1-9b81-47c8-b743-cdbc714df506[Title Two]\n' +
				  '. link:f90d204a-c226-4e44-9593-f9e4b7fdd98c[Title Three]\n';
				  
	var expected = '= Introduction\n\n' + 
				  'This is a test of the emergency broadcast link:title-one.html[system].\n\n' +
				  '== Related Topics\n\n' +
				  '. link:title-one.html[Title One]\n' +
				  '. link:title-two.html[Title Two]\n' +
				  '. link:title-three.html[Title Three]\n';
				  
	iit('replace works', function(){
		var result = svc.replace(content, remoteData);
		expect(result).toEqual(expected);
	});
});