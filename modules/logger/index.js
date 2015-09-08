var bunyan = require('bunyan');
var path = require('path');
var count = 0;
var logFilePath = './logs/errors.log';

var logger = bunyan.createLogger({
    name: 'convertwire',
    streams: [{
        path: logFilePath
    }]
});

module.exports.log = function(){
    count++;
    logger.info(arguments);  
};

module.exports.report = function(){
    var isAre, errors;
    
    if(count > 0){
        isAre = count > 1? 'are' : 'is';
        errors = count > 1? 'errors' : 'error';
        
        console.log('');
        console.log('==========================');
        console.log('There ' + isAre + ' ' + count + ' ' + errors + ' logged to ' + path.resolve(logFilePath));
        console.log('==========================');
        console.log('');
    }
}