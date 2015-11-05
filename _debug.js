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
      
      var filePath = path.resolve('./spec/data/src/f9c350d3-9dc2-46da-b669-8005c46fb800.xml');
      var xml, html, unmapped, formatted, asciidoc, noguids;
      
      xml = fs.readFileSync(filePath, 'utf8');
      
      docx2html.parse(xml, filePath, function(error, topic){
            if(error){
                  console.log(error);
            } else {
                  html = docx2html.toHtml(topic);
                  unmapped = unmapper.unmap(html);
                  formatted = sourceFormatter.format(unmapped);
                  asciidoc = html2AsciiDoc.convert(formatted);
                  noguids = replaceGuids.replace(asciidoc, remoteData);
                  console.log(noguids);
            }
      });
});
