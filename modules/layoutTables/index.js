var isNodejsContext = typeof module !== 'undefined';

if (isNodejsContext) {
    module = module.exports;
    var cheerio = require('cheerio');
    var $;
} else {
    var module = {};
}

var removeLayoutTables = (htmlString, options) => {
    var $tables, isLayoutTable, idCounter, result;
    
    if (isNodejsContext) {
        $ = cheerio.load(htmlString);
    }

    $tables = $(options.selector);
    idCounter = 0;

    isLayoutTable = ($table) => {
        var value, className, counters = {};

        idCounter++;
        className = `_${idCounter}-${options.label}`;
        $table.addClass(className);
        $table.data('temp-id', className);

        counters.tr = $(`.${className} > tbody > tr`).length;
        counters.th = $(`.${className} > tbody > tr > th`).length;
        counters.td = $(`.${className} > tbody > tr > td`).length;

        value = counters.tr === options.limits.tr &&
                counters.th === options.limits.th &&
                counters.td === options.limits.td;
                
        if(value){
            $table.addClass(`_${options.label}s`);
        }

        return value;
    };

    $tables.each((i, table) => {
        var $table = $(table);
        if (isLayoutTable($table)) {
            var markup = '', className, selector;

            className = $table.data('temp-id');
            selector = `.${className} > tbody > tr > td`;

            $(selector).each((cellIndex, cell) => {
                markup += $(cell).html();
            });

            $table.before(`<div>${markup}</div>`);
        }
    });

    $(`._${options.label}s`).remove();
    
    if (isNodejsContext) {
        result = $.html();
    }
    
    return result;
};

module.removeLayoutTables = (htmlString) => {
    
    var twoColumnLayoutTableOptions = {
        label: 'layout-table',
        selector: '#docX-root > table',
        limits: { tr: 1, th: 0, td: 2 }
    };
    
    htmlString = removeLayoutTables(htmlString, twoColumnLayoutTableOptions);
    
    var oneCellLayoutTableOptions = {
        label: 'single-cell-layout-table',
        selector: 'table',
        limits: { tr: 1, th: 0, td: 1 }
    };
    
    htmlString = removeLayoutTables(htmlString, oneCellLayoutTableOptions);
       
    return htmlString;
};