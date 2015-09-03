var bunyan = require('bunyan'); 

var logger = bunyan.createLogger({
    name: 'convertwire',
    streams: [{
        path: './logs/errors.log'
    }]
});

module.exports = logger;