(function (module) {

  'use strict';

  var _ = require('lodash');
  var buildFlags = require('./converters-build-flags.js');


  var headers = {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement: function (content, node) {
      var hLevel = parseInt(node.nodeName.charAt(1)) + 1;
      var hPrefix = '';
      for (var i = 0; i < hLevel; i++) {
        hPrefix += '=';
      }

      content = content.replace(/<.*?><\/.*?>/, '');
      
      var linkMatches = content.match(/link:{\S+\[(.*)]/)
      if (_.isArray(linkMatches) && linkMatches.length > 0) {
        return '\n\n' + hPrefix + ' ' + linkMatches[1] + '\n\n' + content + '\n\n';
      }

      return '\n\n' + hPrefix + ' ' + content + '\n\n';
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
    replacement: function (content) {
      return '*' + content + '*';
    }
  };

  var anchor = {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href');
    },
    replacement: function (content, node) {
      return 'link:' + node.getAttribute('href') + '[' + content + ']';
    }
  };

  var img = {
    filter: 'img',
    replacement: function (content, node) {
      var alt = node.alt || '';
      var src = node.getAttribute('src') || '';
      var title = node.title || '';
      var titlePart = title ? ' "' + title + '"' : '';
      var value = 'image:' + src + titlePart + '[' + alt + ']';
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      return value;
    }
  };
  
  var ul = {
    filter: 'ul',
    replacement: function (content, node) {
      content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ');
      content = content.replace(/\*   /g, '\n' + listItemPrefix);
    
      if(buildFlags.hasDocXBuildFlags(node)){
        content = buildFlags.wrapWithBuildFlags(content, node);
      }
      
      return content;
    }
  };
  
  var listItemPrefix = '*   ';

  var li = {
    filter: 'li',
    replacement: function (content, node) {
      var prefix, parent, orderedItemNumber, hasCodeListings, isOrderedListItem, startValue;
      
      prefix = listItemPrefix;
      parent = node.parentNode;
      orderedItemNumber = Array.prototype.indexOf.call(parent.children, node) + 1;
      hasCodeListings = /----\n/i.test(content);
      isOrderedListItem = /ol/i.test(parent.nodeName);
      
      if(!hasCodeListings){
        content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ');
      }
      
      if(isOrderedListItem){
        
        if(orderedItemNumber === 1){
          startValue = parent.getAttribute('start');
          startValue = (startValue === null)? orderedItemNumber : startValue;
        } else {
          startValue = orderedItemNumber;
        }
        
        prefix = '[start=' + startValue + ']\n' + startValue + '.  ';
      } else {
        prefix = listItemPrefix;
      }

      content = prefix + content;
      
      if(buildFlags.hasDocXBuildFlags(node)){
        content = buildFlags.wrapWithBuildFlags(content, node);
      }
      
      return content;
    }
  };

  var blockquote = {
    filter: 'blockquote',
    replacement: function (content) {
      content = this.trim(content);
      content = content.replace(/\n{3,}/g, '\n\n');
      content = content.replace(/^/gm, '');
      return '\n\n____\n' + content + '\n____\n\n';
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
	      return '\n';
	    }
	  };
    
	  var del = {
	    filter: ['del', 's', 'strike'],
	    replacement: function (content) {
	      return '[line-through]*' + content + '*';
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

  converters.push(headers);
  converters.push(hr);
  converters.push(bold);
  converters.push(anchor);
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