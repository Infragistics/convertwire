(function (module) {

  'use strict';

  var _ = require('lodash');
  var buildFlags = require('./converters-build-flags.js');
  
  var getElementInfo = function(content, node){
    var info = {};
    info.hasCodeListings = /----\n/i.test(content);
    info.isOrderedListItem = /ol/i.test(node.parentNode.nodeName);
    info.hasBuildFlags = typeof node.style.hsBuildFlags !== 'undefined';
    info.shouldIndentContent = (!info.hasCodeListings || !info.hasBuildFlags) && /\\n/g.test(content);
    info.hasBuildFlags = buildFlags.hasDocXBuildFlags(node); 
    return info;
  };

  var headers = {
    filter: function(node){
      var match, tags;
      
      tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      match = false;
      
      if(tags.indexOf(node.nodeName.toLowerCase()) > -1){
        if(tags.className !== 'ig-document-title'){
           match = true;
        }
      }
      
      return match;
    },
    replacement: function (content, node) {
      var hLevel, hPrefix, linkMatches, value;
      
      hLevel = parseInt(node.nodeName.charAt(1)) + 1;
      hPrefix = '';
      
      for (var i = 0; i < hLevel; i++) {
        hPrefix += '=';
      }

      content = content.replace(/<[^>]*>/gi, '');
      
      linkMatches = content.match(/link:{\S+\[(.*)]/)
      if (_.isArray(linkMatches) && linkMatches.length > 0) {
        value = '\n\n' + hPrefix + ' ' + linkMatches[1] + '\n\n' + content + '\n\n';
      } else {
        value = '\n\n' + hPrefix + ' ' + content + '\n\n';
      }
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      return value;
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
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      return '*' + value + '*';
    }
  };

  var anchor = {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href');
    },
    replacement: function (content, node) {
      var value;
      
      value = 'link:' + node.getAttribute('href') + '[' + content + ']';
      
      if(buildFlags.hasDocXBuildFlags(node)){
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
      value = 'image:' + src + titlePart + '[' + alt + ']';
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      return value;
    }
  };
  
  var ul = {
    filter: 'ul',
    replacement: function (content, node) {
      var element;
      
      element = getElementInfo(content, node);
      
      if(element.shouldIndentContent){
        content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ');
        content = content.replace(/\*   /g, '\n' + listItemPrefix);
      }
    
      if(element.hasBuildFlags){
        content = buildFlags.wrapWithBuildFlags(content, node);
      }
      
      return content;
    }
  };
  
  var listItemPrefix = '*   ';

  var li = {
    filter: 'li',
    replacement: function (content, node) {
      var prefix, parent, orderedItemNumber, startValue, element;
      
      prefix = listItemPrefix;
      parent = node.parentNode;
      orderedItemNumber = Array.prototype.indexOf.call(parent.children, node) + 1;
      
      element = getElementInfo(content, node);
      
      if(element.shouldIndentContent){
        content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ');
      }
      
      if(element.isOrderedListItem){
        
        if(orderedItemNumber === 1){
          startValue = parent.getAttribute('start');
          startValue = (startValue === null)? orderedItemNumber : startValue;
        } else {
          startValue = orderedItemNumber;
        }
        
        prefix = '[start=' + startValue + ']\n' + startValue + '.  ';
      } else {
        prefix = '\n' + listItemPrefix;
      }

      content = prefix + content;
      
      if(element.hasBuildFlags){
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
      value =  '\n\n____\n' + content + '\n____\n\n';
      
      if(buildFlags.hasDocXBuildFlags(node)){
        value = buildFlags.wrapWithBuildFlags(value, node);
      }
      
      return 
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
	    replacement: function (content, node) {
        var value;
        
        value = '[line-through]*' + content + '*';
        
        if(buildFlags.hasDocXBuildFlags(node)){
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