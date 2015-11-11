module.exports.get = function(username, password, productOrControlName, version, callback){
	               
    var Firebase = require('firebase');
    var fb = new Firebase('http://ig-topics.firebaseio.com');
    
    var docs = fb.child(`documents/${productOrControlName}/${version}`);
    
    fb.authWithPassword({
      email: username,
      password: password
    }, function (error, authData) {
      if (error) {
        console.log('Login Failed!', error);
      } else {
        console.log('** Authenticated successfully into Firebase **');
        console.log('Attempting to access Firebase data...');
        docs.once('value', callback);
      }
    });
};