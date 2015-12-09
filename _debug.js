var path = require('path');
var fs = require('fs');
var docx2html = require(path.resolve(__dirname, './modules/docXParser'));
var unmapper = require(path.resolve(__dirname, './modules/unmapper'));
var sourceFormatter = require(path.resolve(__dirname, './modules/sourceFormatter'));
var html2AsciiDoc = require(path.resolve(__dirname, './modules/html2AsciiDoc'));
var replaceGuids = require(path.resolve(__dirname, './modules/replaceGuids'));
var cleanup = require(path.resolve(__dirname, './modules/cleanup'));
var remoteData = {};
var result, xml, html, unmapped, formatted, asciidoc, noguids, cleaned;
/*
var repository = require(path.resolve(__dirname, './modules/firebaseRepository'));
var credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, './gulp/credentials.json'), 'utf8'));  
repository.get(credentials.username, credentials.password, 'CommonControls', '16-1', function(snap){
      
      remoteData = snap.val();
                  
      console.log(Object.keys(remoteData).length + ' names loaded');
      
      var filePath = path.resolve('./spec/data/src/22304253-97f9-4cc6-9811-42617c165b04.xml');
      
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
                  result = cleaned = cleanup.asciidoc(noguids);
                  console.log(result);
            }
      });
});
// */
//*
var lookupData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './guid-lookups/Common-LinearGauge-lookup.json'), 'utf8'));
var filePath = 'C:\\Users\\cshoemaker\\Documents\\IG\\Rewire\\convertwire\\spec\\data\\src\\feb10bdf-4cc6-45ce-b33c-aa7bb722be11.xml';
result = fs.readFileSync(filePath, 'utf8');

docx2html.parse(result, filePath, function(error, topic){
      if(error){
            console.log('error: ' + error);
      } else {
            result = docx2html.toHtml(topic);
            result = cleanup.html(result);
            result = unmapper.unmap(result);
            result = sourceFormatter.format(result);
            result = html2AsciiDoc.convert(result);
            result = replaceGuids.replace(result, lookupData);
            result = cleanup.asciidoc(result, 'LinearGauge');
            
            //fs.writeFileSync('C:\\Users\\cshoemaker\\Documents\\IG\\Rewire\\convertwire\\spec\\data\\dest\\test.adoc', result, 'utf8');
            
            console.log(result);
      }
});
// */