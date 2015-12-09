(function (module) {
  
  var buildFlags = require('./converters-build-flags.js');
  
  var divRelatedTopics = {
      filter: function(node){
        var match = node.nodeName === 'DIV' &&
                    node.className.toLowerCase() === 'relatedtopics';
        return match;
      },
      replacement: function(content, node){
        var value;
        
        value = '\n\n== ' + content + '\n';
        
        if(buildFlags.hasDocXBuildFlags(node)){
          value = buildFlags.wrapWithBuildFlags(value, node);
        }
        
        return value;
      } 
    };
    
  var spanIGItalic = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName === 'SPAN' &&
              node.className === 'ig-italic';
      
      return match;
    },
    replacement: function(content, node){
      var value;
      
      value = '_' + content + '_';
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      return value;
    }
  };
  
  var spanIGBold = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName === 'SPAN' &&
              node.className === 'ig-bold';
      
      return match;
    },
    replacement: function(content, node){
      var value;
      
      value = '*' + content + '*';
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      return value;
    }
  };

  var h1DocumentTitle = {
    filter: function(node){
      if(node.nodeName.toLowerCase() === 'h1')
      var match = node.nodeName.toLowerCase() === 'h1' &&
                  node.getAttribute('id') === 'ig-document-title';
      return match;
    },
    replacement: function(content, node){
      var value;
      
      value = '\n\n= ' + content;
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      return value + '\n';
    }
  }; 
  
  var spanNoteCaption = {
    filter: function(node){
			  var match = node.nodeName === 'SPAN' &&
			  				    node.className.toLowerCase() === 'ig-note-caption';
			  return match;
		  },
		  replacement: function(content, node){
        var value;
        
			  value = '.' + content + '\n[NOTE]\n';
        
        if(buildFlags.hasDocXBuildFlags(node)){
          value = buildFlags.wrapWithBuildFlags(value, node);
        }
        
        return value;
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
      var value;
      
      content = content.replace(/\*Note\* /, '');
      content = content.replace(/\*Note:\* /, '');
      value = '\n\n.Note\n[NOTE]\n' + content;
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      return value;
    }
  };
  
  // ================================
  // =====  innovasys:widgets   =====
  // ================================
  
  var innovasysWidgetProperty = {
    filter: 'innovasys:widgetproperty',
    replacement: function(content, node){
      return content;
    }
  };
  
  var innovasysWidgetColorizedExampleCodeSection = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName.toLowerCase() === 'innovasys:widget' &&
              (node.getAttribute('type') === 'Colorized Example Code Section' ||
              node.getAttribute('type') === 'Colorized Example Code' ||
              node.getAttribute('type') === 'Colorized Example Code (Tab Style)');
      
      return match;
    },
    replacement: function(content, node){
      var value = content, language = '', parts;
      
      parts = content.split('\n');
      
      if(parts.length > 0){
        language = parts.shift().replace(/\*/g, '');
        value = '[source,' + language + ']\n----' + parts.join('\n') + '----';
      }
      return value;
    }
  };
  
  var innovasysWidgetIncludeTopic = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName.toLowerCase() === 'innovasys:widget' &&
              node.getAttribute('type') === 'Include Topic';
      
      return match;
    },
    replacement: function(content, node){
      return '\ninclude::' + content.toLowerCase().replace(/_/g, '-') + '.adoc[]\n';
    }
  };
  
  var innovasysWidgetExampleCodeTabStrip = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName.toLowerCase() === 'innovasys:widget' &&
              node.getAttribute('type') === 'Example Code Tab Strip';
      
      return match;
    },
    replacement: function(content, node){
      return content;
    }
  };
  
  var innovasysWidgetPropertyTitle = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName.toLowerCase() === 'innovasys:widgetproperty' &&
              node.getAttribute('name') === 'Title';
      
      return match;
    },
    replacement: function(content, node){
      return '';
    }
  };
  
  var innovasysWidgetPropertyLanguageName = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName.toLowerCase() === 'innovasys:widgetproperty' &&
              node.getAttribute('name') === 'LanguageName';
      
      return match;
    },
    replacement: function(content, node){
      return '*' + content + '*\n';
    }
  };
  
  var innovasysWidgetPropertyContent = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName.toLowerCase() === 'innovasys:widgetproperty' &&
              node.getAttribute('name') === 'Content';
      
      return match;
    },
    replacement: function(content, node){
      return '\n' + content + '\n';
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
      var match = (classIndex >= 0 || idIndex >= 0) && !(typeof node.style.hsBuildFlags !== 'undefined');
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
    //'defaultimg',
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
  converters.push(innovasysWidgetPropertyTitle);
  converters.push(innovasysWidgetColorizedExampleCodeSection);
  converters.push(innovasysWidgetPropertyLanguageName);
  converters.push(innovasysWidgetPropertyContent);
  converters.push(innovasysWidgetExampleCodeTabStrip);
  converters.push(innovasysWidgetIncludeTopic);
  converters.push(innovasysWidgetProperty);
  converters.push(spanIGBold);
  converters.push(spanIGItalic);
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