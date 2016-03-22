const fs = require('fs');

var replacements = [
    { src: 'xaml-wpf-duplicate', dest: 'master-wpf-duplicate'},
    { src: 'master-', dest: '' },
    { src: 'wpf-', dest: 'xaml-wpf-' },
    { src: 'sl-', dest: 'xaml-silverlight-' },
    { src: 'asp.net', dest: 'aspnet' },
    { src: 'win-forms', dest: 'winforms' },
    { src: 'document-engine', dest: 'documentengine' },
    { src: 'excel-engine', dest: 'excelengine' },
    { src: 'common-controls', dest: 'commoncontrols' },
    { src: 'designers-guide', dest: 'designersguide' },
    { src: 'general-concepts', dest: 'generalconcepts' },
    { src: 'bullet-graph', dest: 'bulletgraph' },
    { src: 'data-chart', dest: 'datachart' },
    { src: 'data-grid', dest: 'datagrid' },
    { src: 'doughnut-chart', dest: 'doughnutchart' },
    { src: 'funnel-chart', dest: 'funnelchart' },
    { src: 'linear-gauge', dest: 'lineargauge' },
    { src: 'pie-chart', dest: 'piechart' },
    { src: 'radial-gauge', dest: 'radialgauge' },
    { src: 'surface-chart', dest: 'surfacechart' },
    { src: 'waw', dest: 'webandwin' },
    { src: 'duplicates', dest: 'duplicate' },
    { src: 'xplat', dest: 'common' }
];

const rootPath = `${__dirname}\\~lookups`;

fs.readdir(rootPath, (err, fileNames) => {
    
    fileNames.forEach((fileName) => {
       var newFileName = fileName;
       
       replacements.forEach((replacement) => {
           newFileName = newFileName.replace(replacement.src, replacement.dest);
       });
       
       newFileName = newFileName.toLocaleLowerCase();
       
       console.log(`renaming ${fileName}`);
       
       fs.renameSync(rootPath + '\\' + fileName, rootPath + '\\' + newFileName);
    });
    
    console.log('done');
    
});