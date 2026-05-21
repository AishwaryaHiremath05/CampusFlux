const fs = require('fs');
const { MongoClient } = require('mongodb');

async function run() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('campusflux');
  const collections = await db.collections();
  
  // We'll generate pages for all collections to screenshot them
  for (let i = 0; i < collections.length; i++) {
    const activeCol = collections[i];
    const activeName = activeCol.collectionName;
    const docs = await activeCol.find().limit(5).toArray();
    
    let collectionsHtml = '';
    for (let j = 0; j < collections.length; j++) {
      const col = collections[j];
      const name = col.collectionName;
      collectionsHtml += `
        <div class='sidebar-item ${name === activeName ? 'active' : ''}'>
          <span class='icon'>📄</span> ${name}
        </div>
      `;
    }
    
    const docsHtml = docs.map(d => `<div class='document'><pre>${JSON.stringify(d, null, 2)}</pre></div>`).join('');
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; height: 100vh; background: #ffffff; color: #333; }
        .sidebar { width: 250px; background: #f8f9fa; border-right: 1px solid #e0e0e0; padding: 10px 0; }
        .sidebar-title { font-size: 12px; font-weight: bold; color: #888; padding: 10px 20px; text-transform: uppercase; margin-top: 10px; }
        .sidebar-item { padding: 8px 20px; font-size: 14px; cursor: pointer; display: flex; align-items: center; }
        .sidebar-item:hover { background: #eef2f5; }
        .sidebar-item.active { background: #e3ecef; font-weight: 500; }
        .sidebar-item .icon { margin-right: 10px; font-size: 14px; }
        .main { flex: 1; display: flex; flex-direction: column; }
        .header { height: 60px; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center; padding: 0 20px; font-size: 18px; font-weight: bold; color: #444; }
        .tabs { display: flex; border-bottom: 1px solid #e0e0e0; background: #fafafa; }
        .tab { padding: 10px 20px; font-size: 14px; color: #666; border-bottom: 2px solid transparent; cursor: pointer; }
        .tab.active { color: #13aa52; border-bottom-color: #13aa52; font-weight: 500; }
        .content { flex: 1; padding: 20px; overflow: auto; background: #f4f5f7; }
        .document { background: white; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        pre { margin: 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 13px; color: #24292e; white-space: pre-wrap; }
        .string { color: #032f62; }
        .number { color: #005cc5; }
        .boolean { color: #d73a49; }
        .key { color: #22863a; }
      </style>
    </head>
    <body>
      <div class='sidebar'>
        <div class='sidebar-title'>Databases</div>
        <div class='sidebar-item'><span class='icon'>🗄️</span> admin</div>
        <div class='sidebar-item active'><span class='icon'>🗄️</span> campusflux</div>
        <div style='padding-left: 15px;'>
          ${collectionsHtml}
        </div>
        <div class='sidebar-item'><span class='icon'>🗄️</span> local</div>
      </div>
      <div class='main'>
        <div class='header'>campusflux.${activeName}</div>
        <div class='tabs'>
          <div class='tab active'>Documents</div>
          <div class='tab'>Aggregations</div>
          <div class='tab'>Schema</div>
          <div class='tab'>Explain Plan</div>
          <div class='tab'>Indexes</div>
        </div>
        <div class='content'>
          ${docsHtml || '<div style="padding: 20px; color: #888;">No documents found.</div>'}
        </div>
      </div>
      <script>
        document.querySelectorAll('pre').forEach(block => {
          let text = block.textContent;
          text = text.replace(/(".*?"): /g, '<span class="key">$1</span>: ');
          text = text.replace(/: (".*?")/g, ': <span class="string">$1</span>');
          text = text.replace(/: (\\d+)/g, ': <span class="number">$1</span>');
          text = text.replace(/: (true|false)/g, ': <span class="boolean">$1</span>');
          block.innerHTML = text;
        });
      </script>
    </body>
    </html>
    `;
    
    fs.writeFileSync(`compass_mock_${activeName}.html`, html);
    console.log(`Generated mock UI for ${activeName}`);
  }
  await client.close();
}
run().catch(console.dir);
