'use strict';

var _ = require('lodash');

var replaceWithBreakClassNames = [
  'ig-block-title',
  'languagespecific',
  'lang'
];

var replaceWithBreakIds = [];

var replaceWithNothingClassNames = [
  'defaultimg',
  'ig-content-container',
  'ig-content',
  'ig-layout-container'
];

var replaceWithNothingIDs = [
  'docx-root'
];

module.exports = [
  {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement: function (content, node) {
      var hLevel = parseInt(node.nodeName.charAt(1)) + 1;
      var hPrefix = '';
      for (var i = 0; i < hLevel; i++) {
        hPrefix += '=';
      }
         
      content = content.replace(/<.*?><\/.*?>/, '');
      var linkMatches = content.match(/link:{\S+\[(.*)]/)
      
      if(_.isArray(linkMatches) && linkMatches.length > 0){
        return '\n\n' + hPrefix + ' ' + linkMatches[1] + '\n\n' + content + '\n\n';
      } 
        
      return '\n\n' + hPrefix + ' ' + content + '\n\n'; 
    }
  },

  {
    filter: 'hr',
    replacement: function () {
      return "\n\n'''\n\n";
    }
  },
  {
    filter: ['strong', 'b'],
    replacement: function (content) {
      return '*' + content + '*';
    }
  },

  {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href');
    },
    replacement: function (content, node) {
      return 'link:' + node.getAttribute('href') + '[' + content + ']';
    }
  },

  {
    filter: 'img',
    replacement: function (content, node) {
      var alt = node.alt || '';
      var src = node.getAttribute('src') || '';
      var title = node.title || '';
      var titlePart = title ? ' "' + title + '"' : '';
      return 'image:' + src + titlePart + '[' + alt + ']';
    }
  },

  {
    filter: 'li',
    replacement: function (content, node) {
      content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ');
      var prefix = '*   ';
      var parent = node.parentNode;
      var index = Array.prototype.indexOf.call(parent.children, node) + 1;

      prefix = /ol/i.test(parent.nodeName) ? index + '.  ' : '*   ';
      return prefix + content;
    }
  },

  {
    filter: 'blockquote',
    replacement: function (content) {
      content = this.trim(content);
      content = content.replace(/\n{3,}/g, '\n\n');
      content = content.replace(/^/gm, '');
      return '\n\n____\n' + content + '\n____\n\n';
    }
  },
  
  {
    filter: 'center',
    replacement: function (content) {
      return content;
    }
  },

  {
    filter: function (node) {
      var classIndex = replaceWithNothingClassNames.indexOf(node.className.toLowerCase());
      var idIndex = replaceWithNothingIDs.indexOf(node.id.toLowerCase());
      var match = (classIndex >= 0 || idIndex >= 0);
      return match;
    },
    replacement: function (content) {
      return content;
    }
  },

  {
    filter: function (node) {
      var classIndex = replaceWithBreakClassNames.indexOf(node.className.toLowerCase());
      var idIndex = replaceWithBreakIds.indexOf(node.id.toLowerCase());
      var match = (classIndex >= 0 || idIndex >= 0);
      return match;
    },
    replacement: function (content) {
      return content + '\n';
    }
  }
];