(function (module) {

    'use strict';
	
	var cheerio = require('cheerio');
	var $;

    var util = {

        skipHeaders: [
            'in this topic'
        ],

        getNewMarkup: function (header, content, level) {
            level = level ? level : '2';

            return '<div class="ig-content-container">' +
                       '<h' + level + ' class="ig-header">' + header + '</h' + level + ' >' +
                       '<div class="ig-content">' + content + '</div>' +
                   '</div>';
        },

        parseTables: function ($tables, $tbodys, rowParser) {

            var newMarkup = [];

            $tbodys.each(function (index, tbody) {

                var $tbody = $(tbody);
                var $rows = $($tbody.children('tr'));
                var rowMarkup = '';

                $rows.each(function (rowIndex, row) {

                    var isFirst = rowIndex === 0;
                    var isLast = rowIndex === $rows.length - 1;

                    rowParser(rowIndex, row, isFirst, isLast, function (markup) {
                        rowMarkup += markup;
                    });
                });

                newMarkup.push(rowMarkup);
            });

            $tables.each(function (index, table) {

                $(table).before(newMarkup[index]);

            });

            $tables.remove();
        },

        imLayout: function ($tables, $tbodys, level) {

            $tables = $tables ? $tables : $('.ig-layout');
            $tbodys = $tbodys ? $tbodys : $('.ig-layout>tbody');

            var parse = function (rowIndex, row, isFirst, isLast, cb) {

                var $header = $(row).children('th');
                var header = '';
                var content = $(row).children('td').html();

                if ($header.html() !== undefined) {

                    header = $header.text().trim();

                    var shouldRowBeSkipped = util.skipHeaders.indexOf(header.toLowerCase()) >= 0;

                    if (!shouldRowBeSkipped) {
                        cb(util.getNewMarkup(header, content, level));
                    }

                }
            };

            util.parseTables($tables, $tbodys, parse);
        },

        labeledTable: function ($tables, $tbodys, level) {

            var parse = function (rowIndex, row, isFirst, isLast, cb) {

                // skipping first row that just has labels
                if (!isFirst) {
                    var children = $(row).children();
                    var header = children[0].innerText;
                    var content = children[1].innerHTML;
                    cb(util.getNewMarkup(header, content, level));
                }

            };

            util.parseTables($tables, $tbodys, parse);
            
        },

        steps: function (level) {
            var selector = 'th:contains("Step")';
            var $tables = $(selector).parents('table');
            var $tbodys = $(selector).parents('tbody');

            util.labeledTable($tables, $tbodys, level);
        },

        relatedContent: function () {
            var selector = 'th:contains("Topic"), th:contains("Sample"), th:contains("Samples")';
            var $tables = $(selector).parents('table');
            var $tbodys = $(selector).parents('tbody');

            var parse = function (rowIndex, row, isFirst, isLast, cb) {
                var children, header, content, markup, anchors;

                if (isFirst) {
                    cb('<ul>');
                } else {
                    
                    children = $(row).children();
                    
                    if(children.length >= 0){
                        anchors = $(children[0]).find('a');
                        if(anchors.length > 0){
                            header = anchors[0].outerHTML
                        }
                    }
                    
                    if(children.length >= 1){
                        content = $(children[1]).text();
                    }
                    
                    markup = '';

                    if(header){
                        header = header.replace('<strong>', '');
                        header = header.replace('</strong>', '');
                        header = header.replace('<b>', '');
                        header = header.replace('</b>', '');
    
                        markup = '<li>' + header + ': ' + content + '</li>';
    
                        if (isLast) {
                            markup += '</ul>';
                        }
                    }

                    cb(markup);
                }

            };

            util.parseTables($tables, $tbodys, parse);
        },

        layoutContainer: function (level) {
            var $tables = $('.ig-layout-container').parents('table');
            var $tbodys = $('.ig-layout-container').parents('tbody');

            util.imLayout($tables, $tbodys, level);
        },

        unmap: function (htmlString) {
			$ = cheerio.load(htmlString);
            util.imLayout(null, null, 3);
            util.steps(4);
            util.layoutContainer(3);
            util.relatedContent();
			return $.html().replace(/&#xA0;/g, '&nbsp;');
        }
    };
    
    module.unmap = util.unmap;

}(module.exports));