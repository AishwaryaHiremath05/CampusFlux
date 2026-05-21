const https = require('https');
https.get('https://www.siberindia.edu.in', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const matches = data.match(/<img[^>]+src=[\"\']([^\'\"]+)[\"\'][^>]*>/gi);
    if(matches) {
      console.log(matches.filter(m => m.toLowerCase().includes('logo') || m.toLowerCase().includes('brand')).join('\n'));
    }
  });
});
