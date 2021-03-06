(function (module) {

  const regex = require('../regex');
  
  var buildFlags = require('./converters-build-flags.js');
  
  var getNoteLabel = function(content){
    return regex.japaneseText.test(content) ? '' : '.Note';
  };
  
  var divRelatedTopics = {
      filter: function(node){
        var match = node.nodeName === 'DIV' &&
                    node.className.toLowerCase() === 'relatedtopics';
        return match;
      },
      replacement: function(content, node){
        var value;
        
        if(/li/i.test(node.parentNode.nodeName)){
          value = content;
        } else {
          value = '\n\n== ' + content + '\n';
          
          if(buildFlags.hasDocXBuildFlags(node)){
            value = buildFlags.wrapWithBuildFlags(value, node);
          }
        }
        
        return value;
      } 
    };
    
  var divIGLevel1 = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName === 'DIV' && 
              /ig-level-/i.test(node.className);
      
      return match;
    },
    replacement: function(content, node){
      var value, level, prefix;
      
      level = parseInt(node.className.replace('ig-level-', ''));
      prefix = Array(level + 1).join('*') +  ' ';
      
      value = prefix + content.trim() + '\n\n';
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      } else {
        value = '\n\n' + value;
      }
      
      return value;
    }
  };
  
  var spanClassLang = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName === 'SPAN' &&
              node.className === 'lang';
      
      return match;
    },
    replacement: function(content, node){
      var value;
      
      value = '\n' + content + '\n';
      
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
      
      value = ' _' + content + '_  ';
      
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
      
      value = ' *' + content + '* ';
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      return value;
    }
  };
  
  var codeInText = {
      filter: function(node){
          var match = false;
          match = node.className == 'ig-code-in-text';
          return match;
      },
      replacement: function(content, node){
          return '`' + content + '`';
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
      filter: function (node) {
          var match = node.nodeName === 'SPAN' &&
              node.className.toLowerCase() === 'ig-note-caption';
          return match;
      },
      replacement: function (content, node) {
          return content = content.trim() + '{label}';
      }
  };

  var divNote = {
    filter: function(node){
      var match = false;
      
      match = node.nodeName === 'DIV' &&
              (node.className.toLowerCase() === 'note' ||
               node.className.toLowerCase() === 'ig-note');
      
      return match;
    },
    replacement: function(content, node){
      var value, label;
      
      label = getNoteLabel(content);
      
      content = content.replace(/\*Note:? ?\* /g, '');
      
      var labelParts = content.split('{label}');
      
      if(labelParts && labelParts.length >= 2){
          label = '.' + labelParts[0].trim();
          content = labelParts[1].trim();
      }

      value = label +'\n[NOTE]\n====\n' + content + '\n===={temp:note-end}';
      
      // HACK: 
      //        d858c7af-15e1-44c7-a9b6-599c86e87247 - CommonControls
      //        b0a6e86f-c069-4a2b-87a7-faf24dfed888 - Silverlight
      //value = 'Note\n[NOTE]\n====\n' + content + '\n===={temp:note-end}';
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      return '\n\n' + value + '\n\n';
    }
  };
  
  // ================================
  // =====  innovasys:widgets   =====
  // ================================
  
  var innovasysWidgetProperty = {
    filter: 'innovasys:widgetproperty',
    replacement: function(content, node){
      var isInclude = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(content);

      if(isInclude){
        content = `\n\ninclude::${content}.adoc[]\n\n`
      }

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
        value = '\n\n[source,' + language + ']\n----' + parts.join('\n') + '----\n\n';
      }
      
      value = value.replace(/----([^]*?)----/g, (match) => {
        return match.replace(/\n\n/g, '\n');
      });
      
      value = value.replace(/\]\n----\n\n/g, (match) => {
        return ']\n----\n';
      });
      
      value = value.replace(/(.)----/g, (match) => {
        return match[0] + '\n' + match.substr(1);
      });
      
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
      if(/include::/.test(content)) return content;
      
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
  
  var replaceWithNothingIDs = [
    'docx-root'
  ];
  
  var nothingElements = {
    filter: function (node) {
      var idIndex = replaceWithNothingIDs.indexOf(node.id.toLowerCase());
      var match = idIndex >= 0;
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
  converters.push(divIGLevel1);
  converters.push(spanClassLang);
  converters.push(codeInText);
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