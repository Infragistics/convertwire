const fileNames = require('./fileNames.js');

const fs = require('fs');
const path = require('path');

const rootPath = `C:\\Users\\cshoemaker\\Documents\\Code\\convertwire\\spec\\data`;

var en, ja;

fileNames.forEach((fileName) => {
    en = fileName + '.xml';
    ja = fileName + '.ja-JP.xml';

    if(fs.existsSync(path.join(rootPath, 'src', en))){
        fs.renameSync(path.join(rootPath, 'src', en), path.join(rootPath, 'src-ex', en));
    }

    if(fs.existsSync(path.join(rootPath, 'src', ja))){
        fs.renameSync(path.join(rootPath, 'src', ja), path.join(rootPath, 'src-ex', ja));
    }
});