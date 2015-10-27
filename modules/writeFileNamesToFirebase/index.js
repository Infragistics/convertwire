module = module.exports;

var args = require('yargs')
		.usage('Usage: node index.js $0 $1')
		.demand(['username', 'email address'])
		.argv;

var relativePathToAsciiDocFiles = '../../spec/data/dest';

var path = require('path');
var Firebase = require('firebase');
var fb = new Firebase('https://ig-topics.firebaseio.com/');

fb.authWithPassword({
	email: args.username,
	password: args.password
}, function (error, authData) {
	if (error) {
		console.log('Login Failed!', error);
	} else {
		console.log('Authenticated successfully');
	}
});

var extractFileName = require(path.resolve(__dirname, '../extractFileName'));
var value = extractFileName.read(relativePathToAsciiDocFiles);

var docs = fb.child('documents');
docs.set(value.documents, function(err, status){
	console.log('File names loaded into Firebase.');
});