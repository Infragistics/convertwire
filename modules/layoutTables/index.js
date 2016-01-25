var isNodejsContext = typeof module !== 'undefined';

if (isNodejsContext) {
    module = module.exports;
    var cheerio = require('cheerio');
    var $;
} else {
    var module = {};
}

module.removeLayoutTables = (htmlString) => {
    var result = '', $tables, isLayoutTable;
    
    if(isNodejsContext){
        $ = cheerio.load(htmlString);
    }

    var $tables = $('#docX-root > table');

    var idCounter = 0;

    isLayoutTable = ($table) => {
        var value, className, counters;

        idCounter++;
        className = `_${idCounter}-layout-table`;
        $table.addClass(className);
        $table.addClass('_layout-tables');
        $table.data('temp-id', className);

        counters = {
            tr: 0,
            th: 0,
            td: 0
        }

        counters.tr = $(`.${className} > tbody > tr`).length;
        counters.th = $(`.${className} > tbody > tr > th`).length;
        counters.td = $(`.${className} > tbody > tr > td`).length;
        
        value = counters.tr === 1 &&
                    counters.th === 0 &&
                    counters.td === 2;
                    
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

    $('._layout-tables').remove();

    if (isNodejsContext) {
        result = $.html();
    }

    return result;
};