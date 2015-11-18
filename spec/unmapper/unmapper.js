var isNodejsContext = typeof module !== 'undefined';
 
if(isNodejsContext){
	module = module.exports;
	var cheerio = require('cheerio');
	var $;
} else {
	var module = {};
}

var skipHeaders = ['in this topic'];

var getNewMarkup = (header, anchorMarkup, content, buildFlags, headerLevel) => {
    var markup = '';
    
    buildFlags = buildFlags? buildFlags : '';
    
    headerLevel = headerLevel ? headerLevel : 2;

    markup = `<div class="ig-content-container" ${buildFlags}> 
                ${anchorMarkup}
                <h${headerLevel} class="ig-header">${header}</h${headerLevel}>
                <div class="ig-content">${content}</div>
            </div>`;
            
    return markup;
};

var getStepMarkup = (header, content, buildFlags) => {
    var value, headerLevel = 3;   
    value = getNewMarkup(header, '', content, buildFlags, headerLevel);
    return value;
};

var getContents = function(element, contentType){
    var $element, contents = '';
    
    $element = $(element);
    if($element[contentType]()){
        contents = $element[contentType]().trim();
    }
    
    return contents;
};

var createNewMarkupFromLayoutTables = () => {
    var $tbody, $tbodys, $row, $rows, header, $header, headerPlainText, content, hasContent, style, 
        buildFlags = '', rowMarkup = [], tableMarkup = [], value = {};
    
    $tbodys = $('table.ig-layout > tbody');
    
    $tbodys.each((tbodyIndex, tbody) => {
        $tbody = $(tbody);
        $rows = $tbody.children();
        
        rowMarkup = [];
        $rows.each((rowIndex, row) => {
            $row = $(row);
            
            $header = $(getContents($row.find('th')[0], 'html'));
            
            var anchorMarkup = '';
            
            if($header.find('a').length > 0){
                anchorMarkup = $('<div>').append($header.find('a')[0]).html();
            }
            
            header = $header.text();
            
            content = getContents($row.find('.ig-layout-container'), 'html');
            
            style = $row.attr('style');
            if(style){
                buildFlags = `style="${style}"`;
            }
            
            hasContent = header.length > 0 &&
                         skipHeaders.indexOf(header.toLowerCase()) === -1 && 
                         content.length > 0;
            
            if(hasContent){
                rowMarkup.push(getNewMarkup(header, anchorMarkup, content, buildFlags));
            }
        });
        
        tableMarkup.push(rowMarkup.join('\n'));
    });
    
    value.markup = tableMarkup;
    value.$tbodys = $tbodys;
    
    return value;
};

var createNewMarkupFromStepTables = () => {
    var $tbody, $tbodys, $row, $rows, header, content, hasContent, style, 
        buildFlags = '', rowMarkup = [], tableMarkup = [], value = {};
    
    $tbodys = $('th:contains("Step")').closest('table').children();
    
    $tbodys.each((tbodyIndex, tbody) => {
        $tbody = $(tbody);
        $rows = $tbody.children();
        
        rowMarkup = [];
        $rows.each((rowIndex, row) => {
            $row = $(row);
            header = getContents($row.find('td')[0], 'text');
            content = getContents($row.find('td')[1], 'html');
            
            style = $row.attr('style');
            if(style){
                buildFlags = `style="${style}"`;
            }
            
            hasContent = header.length > 0 && 
                         content.length > 0;
            
            if(hasContent){
                rowMarkup.push(getStepMarkup(header, content, buildFlags));
            }
        });
        
        tableMarkup.push(rowMarkup.join('\n'));
    });
    
    value.markup = tableMarkup;
    value.$tbodys = $tbodys;
    
    return value;
};

var addNewMarkup = (tableInfo) => {
    var $table;
    
    tableInfo.$tbodys.each((index, tbody) => {
        $table = $(tbody).closest('table');
        $table.after(tableInfo.markup[index]);
        
        $table.remove();
    });
};
    
var unmap = (htmlString) => {
    var result = '', layoutTableInfo, stepsTableInfo;
    
    if(isNodejsContext){
        $ = cheerio.load(htmlString);
    }
    
    layoutTableInfo = createNewMarkupFromLayoutTables();
    addNewMarkup(layoutTableInfo);
    
    stepsTableInfo = createNewMarkupFromStepTables();
    addNewMarkup(stepsTableInfo);
    
    if(isNodejsContext){
        result = $.html();
    }
    
    return result;
};

module.unmap = unmap;