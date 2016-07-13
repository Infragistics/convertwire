describe('end to end', function() {
    
    const path = require('path');
    const docx2html = require(path.resolve(__dirname, '../modules/docXParser'));
    const unmapper = require(path.resolve(__dirname, '../modules/unmapper'));
    const layoutTables = require(path.resolve(__dirname, '../modules/layoutTables'));
    const sourceFormatter = require(path.resolve(__dirname, '../modules/sourceFormatter'));
    const html2AsciiDoc = require(path.resolve(__dirname, '../modules/html2AsciiDoc'));
    const replaceGuids = require(path.resolve(__dirname, '../modules/replaceGuids'));
    const cleanup = require(path.resolve(__dirname, '../modules/cleanup'));
    
    describe('html to asciidoc', function(){
        
        it('preserves code indentation', function () {
            var src, dest; 
            
            src = `<div id="Example_CS" class="LanguageSpecific">
    <p><span class="lang"><b>In C#:</b></span></p><pre>
    <span class="code"><span class="keyword">private void</span> UltraGrid1InitializeRow(<span class="keyword">object</span> sender, InitializeRowEventArgs e)
    {
        UltraGridColumn column = ultraGrid1.DisplayLayout.Bands[1].Columns[2];
        {
            <span class="keyword">if</span> (cellText == <span class="string">&quot;PG&quot;</span>)
                e.Row.StartsNewPrintedPage = <span class="keyword">true</span>;
        }
    }
    </span>
    </pre></div>`;

            src = cleanup.html(src);
            src = layoutTables.removeLayoutTables(src); 
            src = unmapper.unmap(src);
            src = sourceFormatter.format(src);
            src = html2AsciiDoc.convert(src);
            dest = cleanup.asciidoc(src, 'WinForms');
            
			var expected = `*In C#:*

[source,csharp]
----
    private void UltraGrid1InitializeRow(object sender, InitializeRowEventArgs e)
    {
        UltraGridColumn column = ultraGrid1.DisplayLayout.Bands[1].Columns[2];
        {
            if (cellText == "PG")
                e.Row.StartsNewPrintedPage = true;
        }
    } 
----`;
            
            
            
			expect(dest).toEqual(expected);
        
    });
    
    

        
    });
});