var path = require('path');
var fs = require('fs');
var docx2html = require(path.resolve(__dirname, './modules/docXParser'));
var unmapper = require(path.resolve(__dirname, './modules/unmapper'));
var sourceFormatter = require(path.resolve(__dirname, './modules/sourceFormatter'));
var html2AsciiDoc = require(path.resolve(__dirname, './modules/html2AsciiDoc'));
var replaceGuids = require(path.resolve(__dirname, './modules/replaceGuids'));
var remoteData;

var repository = require(path.resolve(__dirname, './modules/firebaseRepository'));
var credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, './gulp/credentials.json'), 'utf8'));  
repository.get(credentials.username, credentials.password, 'DataChart', function(snap){
      
      remoteData = snap.val();
                  
      console.log(Object.keys(remoteData).length + ' names loaded');
      
      var filePath = path.resolve('./spec/data/src/df0a8627-2218-4100-9011-5e109745c35e.xml');
      var result, xml, html, unmapped, formatted, asciidoc, noguids;
      
      result = xml = fs.readFileSync(filePath, 'utf8');
      
      docx2html.parse(xml, filePath, function(error, topic){
            if(error){
                  console.log('error: ' + error);
            } else {
                  result = html = docx2html.toHtml(topic);
                  result = unmapped = unmapper.unmap(html);
                  result = formatted = sourceFormatter.format(unmapped);
                  result = asciidoc = html2AsciiDoc.convert(formatted);
                  result = noguids = replaceGuids.replace(asciidoc, remoteData);
                  console.log(result);
            }
      });
});