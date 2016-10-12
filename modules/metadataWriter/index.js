/*jslint node: true */
/*jshint esversion: 6 */

module = module.exports;

const fs = require('fs');
const path = require('path');

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

var getSearchReplaceExpressions = (source) => {
    var isTags = /tags\:/.test(source.replace(/"/,''));
    var oldLabel, newLabel;

    if(isTags) {
        oldLabel = 'tags';
        newLabel = 'controlName';
    } else {
        oldLabel = 'controlName';
        newLabel = 'tags';
    }

    return {
        src: new RegExp(RegExp.escape(source)),
        dest: source.replace(oldLabel, newLabel)
    };
};

var getValues = (text) => {
    var rawValues =  /\[(.+)\]/.exec(text);
    var values = [];

    if(rawValues  && rawValues.length > 1) {
        values = rawValues[1].replace(/"/g, '').split(',');
    }

    return values;
};

var isSwitched = (tags, controls) => {
    var value = false;
    if(tags.length > 0) {
        tags.forEach((tag) => {
            if(controls.indexOf(tag) > -1) {
                value = true;
            }
        });
    }
    return value;
};

module.fix = (pathToFiles) => {

    var controls = JSON.parse(fs.readFileSync(path.resolve(__dirname, './controls.json'), 'utf8'));

    var fileNames = fs.readdirSync(pathToFiles);
    var count = fileNames.length;

    console.log(`Processing ${count} files`);

    fileNames.forEach((fileName) => {
        if(path.extname(fileName) === '.adoc'){
            var fullPath = path.join(pathToFiles, fileName);
            var text = fs.readFileSync(fullPath, 'utf8');

            var tagMatches = text.match(/tags" ?: ?.+/);
            var controlNameMatches = text.match(/controlName" ?: ?.+/);

            var controlNames = [];
            var tags = [];

            var isMetadataSwitched = false;

            var tagSearchExpressions, controlsSearchExpression;

            if(tagMatches && controlNameMatches) {
                if(tagMatches.length > 0 && controlNameMatches.length > 0) {
                    tags = getValues(tagMatches[0]);
                    controlNames = getValues(controlNameMatches[0]);
                }
            }

            isMetadataSwitched = isSwitched(tags, controls);

            if(isMetadataSwitched) {
                tagSearchExpressions = getSearchReplaceExpressions(tagMatches[0]);
                controlsSearchExpression = getSearchReplaceExpressions(controlNameMatches[0]);

                text = text.replace(tagSearchExpressions.src, tagSearchExpressions.dest);
                text = text.replace(controlsSearchExpression.src, controlsSearchExpression.dest);

                console.log(text.substr(0, 250) + ' \n\n' + fullPath + '\n===========================\n\n');
            }

            fs.writeFileSync(fullPath, text, 'utf8');
        }
    });

    console.log('Done: ' + pathToFiles);
};