module = module.exports;

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const os = require('os');

var diff = (path1, path2) => {
    var path1Files = fs.readdirSync(path1);
    var path2Files = fs.readdirSync(path2);
    var diffFiles = [];

    console.log('detecting differences');
    
    diffFiles = _.difference(path2Files, path1Files);
    
    console.log(`There are ${diffFiles.length} diff files.`);
    
    if(diffFiles.length > 0) {
        fs.writeFileSync(path1 + '\\diff.txt', diffFiles.join(os.EOL));
    }
    
    console.log('done');
};

diff(`C:\\Users\\cshoemaker\\Documents\\Code\\convertwire\\spec\\data\\dest`, `C:\\Users\\cshoemaker\\Documents\\Code\\convertwire\\spec\\data\\dest-rename`);