/*jslint node: true */
/*jshint esversion: 6 */

//link:(.+?)\[

module = module.exports;

const fs = require('fs');
const path = require('path');

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

module.replace = (pathToFiles) => {

    var fileNames = fs.readdirSync(pathToFiles);
    var count = fileNames.length;
    //var linkPattern = /link:(.+?)\[/gi;
    var linkPattern = /link:(.+?)(\-)(members|ctor|properties|ev|namespace|methods)\.html\[/gi;

    console.log(`Processing ${count} files`);

    fileNames.forEach((fileName) => {
        if(path.extname(fileName) === '.adoc'){
            var fullPath = path.join(pathToFiles, fileName);
            var text = fs.readFileSync(fullPath, 'utf8');
            var links = text.match(linkPattern);
            var testVal;
            if(links) {
                links.forEach((link) => {
                    //link = link.replace(linkPattern, '$1');
                    testVal = link.replace('.html', '');
                    if(!/https?:\/\//.test(link) && !/mailto/.test(link) && /\./.test(testVal)) {

                        /*
                        var buildVariables = link.match(/\{.+?\}/g);

                        link = link.toLowerCase();

                        if(buildVariables) {
                            buildVariables.forEach((variable) => {
                                link = link.replace(new RegExp(variable, 'gi'), variable);
                            });
                        }

                        var expr = new RegExp(RegExp.escape(link), 'gi');
                        text = text.replace(expr, link.replace(/_/g, '-'));
                        */

                        //(\-)(members|ctor|properties|ev|namespace|methods)
                        var apiLink = link.replace(/\-members\.html/gi, '_members.html')
                                          .replace(/\-ctor\.html/gi, '_ctor.html')
                                          .replace(/\-properties\.html/gi, '_properties.html')
                                          .replace(/\-ev\.html/gi, '_ev.html')
                                          .replace(/\-namespace\.html/gi, '_namespace.html')
                                          .replace(/\-methods\.html/gi, '_methods.html');

                        var expr = new RegExp(RegExp.escape(link), 'gi');
                        text = text.replace(expr, apiLink);

                        //console.log(apiLink);
                    }
                });
            }

            fs.writeFileSync(fullPath, text, 'utf8');
        }
    });

/*
    console.log('verifying...');
    fileNames.forEach((fileName) => {
        if(path.extname(fileName) === '.adoc'){
            var fullPath = path.join(pathToFiles, fileName);
            var underscoreLinks = [];
            var text = fs.readFileSync(fullPath, 'utf8');
            var links = text.match(linkPattern);
            if(links) {
                links.forEach((link) => {
                    link = link.replace(linkPattern, '$1');
                    if(link.indexOf('_') > -1){
                        underscoreLinks.push(`${fileName}: ${link}`);
                    }
                });
            }
        }
    });
*/
    console.log('done: ' + pathToFiles);
};