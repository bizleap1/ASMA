const https = require('https');

const search = (query) => {
  return new Promise((resolve) => {
    https.get('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const match = data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
        resolve(match ? match[1] : null);
      });
    });
  });
};

Promise.all([
  search('stock market basics zerodha varsity'),
  search('candlestick patterns zerodha varsity'),
  search('risk management zerodha varsity')
]).then(console.log);
