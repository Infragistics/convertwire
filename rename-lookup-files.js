const fs = require('fs');

var replacements = [
    { src: 'master-', dest: '' },
    { src: 'asp-net', dest: 'aspnet' },
    { src: 'asp.net', dest: 'aspnet' },
    { src: 'win-forms', dest: 'winforms' },
    { src: 'waw-chart', dest: 'chart' },
    { src: 'waw-document-engine', dest: 'documentengine' },
    { src: 'waw-excel-engine', dest: 'excelengine' },
    { src: 'xaml-', dest: '' },
    { src: 'common-controls', dest: 'commoncontrols' },
    { src: 'designers-guide', dest: 'designersguide' },
    { src: 'general-concepts', dest: 'generalconcepts' },
    { src: 'xplat', dest: 'x-plat' },
    { src: 'x-plat-bullet-graph', dest: 'bulletgraph' },
    { src: 'x-plat-data-chart', dest: 'datachart' },
    { src: 'x-plat-data-grid', dest: 'datagrid' },
    { src: 'x-plat-doughnut-chart', dest: 'doughnutchart' },
    { src: 'x-plat-funnel-chart', dest: 'funnelchart' },
    { src: 'x-plat-linear-gauge', dest: 'lineargauge' },
    { src: 'x-plat-pie-chart', dest: 'piechart' },
    { src: 'x-plat-radial-gauge', dest: 'radialgauge' },
    { src: 'x-plat-surface-chart', dest: 'surfacechart' },
    { src: 'x-plat-barcodes', dest: 'barcodes' },
    { src: 'x-plat-spreadsheet', dest: 'spreadsheet' },
    //{ src: 'waw', dest: 'webandwin' },
    { src: 'duplicates', dest: 'duplicate' }//,
    //{ src: 'xplat', dest: 'common' }
];

const rootPath = `${__dirname}\\~lookups`;

fs.readdir(rootPath, (err, fileNames) => {
    
    fileNames.forEach((fileName) => {
       var newFileName = fileName.toLocaleLowerCase();
       
       replacements.forEach((replacement) => {
           newFileName = newFileName.replace(replacement.src, replacement.dest);
       });
       
       //newFileName = newFileName.toLocaleLowerCase();
       
       console.log(`renaming ${fileName}`);
       
       fs.renameSync(rootPath + '\\' + fileName, rootPath + '\\' + newFileName);
    });
    
    console.log('done');
    
});