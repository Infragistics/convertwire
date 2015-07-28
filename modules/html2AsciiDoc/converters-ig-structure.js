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

  converters.push(divRelatedTopics);
  converters.push(nothingElements);
  converters.push(breakElements);
  converters.push(metadata);

  module.get = function () {
    return converters;
  };

} (module.exports));