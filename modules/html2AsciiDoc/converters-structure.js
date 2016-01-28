(function (module) {

  'use strict';

  var _ = require('lodash');
  var buildFlags = require('./converters-build-flags.js');
  var listElements = ['UL', 'OL', 'LI'];

  var getListDepth = function (node, level, increment) {
    var isListElement, isListItemElement;

    isListElement = _.contains(listElements, node.nodeName);
    isListItemElement = node.nodeName === 'LI';

    if (isListElement) {
      level += increment;

      if (isListItemElement) {
        level = getListDepth(node.parentNode, level, 1);
      }
      else {
        level = getListDepth(node.parentNode, level, 0);
      }
    }

    return level;
  };

  var getListLevel = function (node, level) {
    var increment;

    if (!level) {
      level = 0;
    }

    increment = level;

    level = getListDepth(node, level, increment);

    return level;
  };

  var getElementInfo = function (content, node) {
    var info = {};
    info.isOrderedListItem = /ol/i.test(node.parentNode.nodeName);
    info.delimiter = /ol/i.test(node.parentNode.nodeName)? '.' : '*';
    info.listLevel = getListLevel(node);
    info.hasBuildFlags = buildFlags.hasDocXBuildFlags(node);
    info.orderedItemNumber = Array.prototype.indexOf.call(node.parentNode.children, node) + 1;
    info.isNestedListItemContainer = _.startsWith(content, '\n*') || _.startsWith(content, '\n.'); ///li|ol/i.test(node.parentNode.parentNode.nodeName);
    return info;
  };

  var headers = {
    filter: function (node) {
      var match, tags;

      tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      match = false;

      if (tags.indexOf(node.nodeName.toLowerCase()) > -1) {
        if (node.className !== 'ig-document-title') {
          match = true;
        }
      }

      return match;
    },
    replacement: function (content, node) {
      var hLevel, hPrefix, value, anchorMatches, anchor = '';

      hLevel = parseInt(node.nodeName.charAt(1)) + 1;
      hPrefix = '';
      
      if(hLevel >= 6){
          hLevel = 6;
      }
      
      hPrefix = Array(hLevel + 1).join('=');
      
      if(!_.contains(content, '<<')){
        content = content.replace(/<[^>]*>/gi, '');  
      }
      
      anchorMatches = content.match(/\[\[(.*?)\]\]/);
      if(_.isArray(anchorMatches) && anchorMatches.length >= 2){
        anchor = content.substr(0,content.lastIndexOf('\n'));
        content = content.substr(content.lastIndexOf('\n') + 1, content.length);
      }

      value = '\n' + hPrefix + ' ' + content;

      if (buildFlags.hasDocXBuildFlags(node)) {
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      value = '\n\n' + anchor + value + '\n\n';
      
      value = value.replace('\n\n\n', '\n\n');

      return value;
    }
  };
  
  var spanTemporary = {
    filter: function(node){
      var match = false;
      match = (node.nodeName === 'SPAN' && 
               node.className === 'temporary');
      return match;
    },
    replacement: function(content, node){
      return '';
    }
  };

  var hr = {
    filter: 'hr',
    replacement: function () {
      return "\n\n'''\n\n";
    }
  };

  var bold = {
    filter: ['strong', 'b'],
    replacement: function (content, node) {
      var value;

      value = content;

      if (buildFlags.hasDocXBuildFlags(node)) {
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      return '*' + value + '*';
    }
  };
  
  var italic = {
    filter: ['em', 'i'],
    replacement: function (content, node) {
      var value = ' ';
      
      if(content !== ' ') {
        value = content;

        if (buildFlags.hasDocXBuildFlags(node)) {
            value = buildFlags.wrapWithBuildFlags(value, node);
        }
        
        value = ' _' + value + '_ ';
      }
      
      return value;

    }
  };
  
  var paragraph = {
    filter: 'p',
    replacement: function (content, node) {
      var value;

      value = content;

      if (buildFlags.hasDocXBuildFlags(node)) {
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      return '\n\n' + value.trim(); + '\n\n';
    }
  };

  var anchorWithoutHref = {
    filter: function (node) {
      return node.nodeName === 'A' && 
            (node.getAttribute('href') === null) &&
            (node.getAttribute('id') === null);
    },
    replacement: function (content, node) {
      return '';
    }
  };
  
  var anchorWithIdAsAnchor = {
    filter: (node) => {
      var match = false, id, name;
      
      id = node.getAttribute('id');
      name = node.getAttribute('name');
      
      match = (node.nodeName === 'A' && id !== null) ||
              (node.nodeName === 'A' && name !== null);
      
      return match;
    },
    replacement: (content, node) => {
      var value = '', id, name, identifier;
      
      id = node.getAttribute('id');
      name = node.getAttribute('name');
      
      if(!_.startsWith(id, 'OLE')){
        identifier = id ? id : name;
        
        value = `[[${identifier}]]\n${content}`;
      }
      
      return value;
    }
  };
  
  var anchorInDocumentHref = {
    filter: (node) => {
      var match = false, href;
      
      href = node.getAttribute('href');
      if(node.nodeName === 'A' && href !== null){
        match = (href[0] === '#');
      } 
      
      return match;
    },
    replacement: (content, node) => {
      var value, href;
      
      href = node.getAttribute('href').replace('#', '');
      
      value = `<<${href},${content}>>`;
      
      return value; 
    }
  };

  var anchorWithHref = {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href');
    },
    replacement: function (content, node) {
      var value;

      value = 'link:' + node.getAttribute('href') + '[' + content + ']';

      if (buildFlags.hasDocXBuildFlags(node)) {
        value = buildFlags.wrapWithBuildFlags(value, node);
      }

      return value;
    }
  };

  var img = {
    filter: 'img',
    replacement: function (content, node) {
      var alt, src, title, titlePart, value

      alt = node.alt || '';
      src = node.getAttribute('src') || '';
      title = node.title || '';
      titlePart = title ? ' "' + title + '"' : '';
      value = 'image::' + src + titlePart + '[' + alt + ']';

      if (buildFlags.hasDocXBuildFlags(node)) {
        value = buildFlags.wrapWithBuildFlags(value, node);
      }

      return '\n\n' + value + '\n\n';
    }
  };

  var ul = {
    filter: ['ul', 'ol'],
    replacement: function (content, node) {
      var element;

      element = getElementInfo(content, node);

      if (element.hasBuildFlags) {
        content = buildFlags.wrapWithBuildFlags(content, node);
      }

      return '\n\n\<temp-token role="list:start">' + content + '\n\n';
    }
  };

  var li = {
    filter: 'li',
    replacement: function (content, node) {
      var 
        prefix = '', 
        parent = node.parentNode,  
        startValue, 
        element;
      
      element = getElementInfo(content, node);
     
      prefix = Array(element.listLevel + 1).join(element.delimiter) + ' ';
      
      if(element.isOrderedListItem){
        if (element.orderedItemNumber === 1) {
          startValue = parent.getAttribute('start');
          startValue = (startValue === null) ? element.orderedItemNumber : startValue;
        } else {
          startValue = element.orderedItemNumber;
        }
        prefix = '[start=' + startValue + ']\n' + prefix;
      } 
      
      content = prefix + content + '\n';

      if (element.hasBuildFlags) {
        content = buildFlags.wrapWithBuildFlags(content, node);
      }

      return content;
    }
  };

  var blockquote = {
    filter: 'blockquote',
    replacement: function (content, node) {
      var value;

      content = this.trim(content);
      content = content.replace(/\n{3,}/g, '\n\n');
      content = content.replace(/^/gm, '');
      value = '\n\n____\n' + content + '\n____\n\n';

      if (buildFlags.hasDocXBuildFlags(node)) {
        value = buildFlags.wrapWithBuildFlags(value, node);
      }

      return value;
    }
  };

  var center = {
    filter: 'center',
    replacement: function (content) {
      return content;
    }
  }

  var br = {
    filter: 'br',
    replacement: function () {
      return '\n\n';
    }
  };

  var del = {
    filter: ['del', 's', 'strike'],
    replacement: function (content, node) {
      var value;

      value = '[line-through]*' + content + '*';

      if (buildFlags.hasDocXBuildFlags(node)) {
        value = buildFlags.wrapWithBuildFlags(value, node);
      }

      return value;
    }
  };

  var checkboxListItem = {
    filter: function (node) {
      return node.type === 'checkbox' && node.parentNode.nodeName === 'LI';
    },
    replacement: function (content, node) {
      return (node.checked ? '[x]' : '[ ]') + ' ';
    }
  };

  var converters = [];

  converters.push(italic);
  converters.push(anchorWithIdAsAnchor);
  converters.push(headers);
  converters.push(hr);
  converters.push(spanTemporary);
  converters.push(bold);
  converters.push(paragraph);
  converters.push(anchorWithoutHref);
  converters.push(anchorInDocumentHref);
  converters.push(anchorWithHref);
  converters.push(img);
  converters.push(ul);
  converters.push(li);
  converters.push(blockquote);
  converters.push(center);
  converters.push(br);
  converters.push(del);
  converters.push(checkboxListItem);

  module.get = function () {
    return converters;
  };

} (module.exports));