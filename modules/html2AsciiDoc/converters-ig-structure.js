(function (module) {
  
  
  var divRelatedTopics = {
      filter: function(node){
        var match = node.nodeName === 'DIV' &&
                    node.className.toLowerCase() === 'relatedtopics';
        return match;
      },
      replacement: function(content){
        return '\n\n== ' + content + '\n';
      } 
    };

  var h1DocumentTitle = {
    filter: function(node){
      if(node.nodeName.toLowerCase() === 'h1')
      var match = node.nodeName.toLowerCase() === 'h1' &&
                  node.getAttribute('id') === 'ig-document-title';
      return match;
    },
    replacement: function(content){
      return '\n\n= ' + content;
    }
  }; 
  
  var spanNoteCaption = {
    filter: function(node){
			  var match = node.nodeName === 'SPAN' &&
			  				    node.className.toLowerCase() === 'ig-note-caption';
			  return match;
		  },
		  replacement: function(content){
			  return '.' + content + '\n[NOTE]\n';
		  }
  };
  
  var divNote = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName === 'DIV' &&
              node.className.toLowerCase() === 'note';
      
      return match;
    },
    replacement: function(content, node){
      content = content.replace(/\*Note\* /, '');
      content = content.replace(/\*Note:\* /, '');
      return '\n\n.Note\n[NOTE]\n' + content;
    }
  };
  
  
  // ================================
  // =====  replace with break  =====
  // ================================

  var replaceWithBreakClassNames = [
    'ig-block-title',
    'languagespecific',
    'lang'
  ];
  
  var replaceWithBreakIds = [];

  var breakElements = {
    filter: function (node) {
      var classIndex = replaceWithBreakClassNames.indexOf(node.className.toLowerCase());
      var idIndex = replaceWithBreakIds.indexOf(node.id.toLowerCase());
      var match = (classIndex >= 0 || idIndex >= 0);
      return match;
    },
    replacement: function (content) {
      return content + '\n';
    }
  };
  
  // ================================
  // ===== replace with nothing =====
  // ================================
  
  var replaceWithNothingClassNames = [
    'defaultimg',
    'ig-content-container',
    'ig-content',
    'ig-layout-container'
  ];
  
  var replaceWithNothingIDs = [
    'docx-root'
  ];
  
  var nothingElements = {
    filter: function (node) {
      var classIndex = replaceWithNothingClassNames.indexOf(node.className.toLowerCase());
      var idIndex = replaceWithNothingIDs.indexOf(node.id.toLowerCase());
      var match = (classIndex >= 0 || idIndex >= 0);
      return match;
    },
    replacement: function (content) {
      return content;
    }
  };
  
  var metadata = {
    filter: function(node){
      var match = node.id === 'metadata';
      return match;
    },
    replacement: function (content) {
      return '////\n' + content + '////';
    }
  };

  var converters = [];

  converters.push(h1DocumentTitle);
  converters.push(spanNoteCaption);
  converters.push(divNote);
  converters.push(divRelatedTopics);
  converters.push(nothingElements);
  converters.push(breakElements);
  converters.push(metadata);

  module.get = function () {
    return converters;
  };

} (module.exports));