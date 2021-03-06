module = module.exports;

var path = require('path');
var fs = require('fs');
var credentials = null;
var args = {};

if(fs.existsSync(path.resolve(__dirname, '../../gulp/credentials.json'))){
	credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../gulp/credentials.json'), 'utf8'));  	
}

if(credentials){
	args = require('yargs')
		.usage('Usage: node index.js $0 $1')
		.demand(['name', 'version'])
		.option('version' , { type: 'string' })
		.argv;
		
	args.username = credentials.username;
	args.password = credentials.password;
} else {
	args = require('yargs')
		.usage('Usage: node index.js $0 $1 $2 $3')
		.demand(['username', 'password', 'name', 'version'])
		.option('version' , { type: 'string' })
		.argv;
}

var relativePathToAsciiDocFiles = '../../spec/data/dest';
var productOrControlName = args.name;
var Firebase = require('firebase');
var fb = new Firebase('https://ig-topics.firebaseio.com/');

args.version = args.version.replace('.', '-');

fb.authWithPassword({
	email: args.username,
	password: args.password
}, function (error, authData) {
	if (error) {
		console.log('Login Failed!', error);
	} else {
		console.log('Authenticated successfully');
		
		var extractFileName = require(path.resolve(__dirname, '../extractFileName'));
		var value = extractFileName.read(relativePathToAsciiDocFiles);
		
		var docs = fb.child(`documents/${productOrControlName}/${args.version}`);
		docs.set(value.documents, function(err, status){
			console.log(Object.keys(value.documents).length + ' file names loaded into Firebase.');
		});
	}
});