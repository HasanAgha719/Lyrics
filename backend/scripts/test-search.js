import http from 'http';

const testQueries = [
  'Hussain',
  'Husain',
  'Hussin',
  'Abas',
  'Abbas ka alam'
];

const runTest = (query) => {
  return new Promise((resolve, reject) => {
    const url = `http://127.0.0.1:5000/api/lyrics/search?q=${encodeURIComponent(query)}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ query, count: json.length, results: json.map(item => `${item.category} -> ${item.person} -> ${item.title} (${item.reciter})`) });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const runAllTests = async () => {
  console.log('Running programmatic fuzzy search verification...');
  for (const q of testQueries) {
    try {
      const res = await runTest(q);
      console.log(`\nQuery: "${res.query}" returned ${res.count} results:`);
      res.results.forEach((r, idx) => console.log(`  ${idx + 1}. ${r}`));
    } catch (error) {
      console.error(`Error querying "${q}":`, error.message);
    }
  }
};

// Wait 1.5 seconds for server to be fully responsive
setTimeout(runAllTests, 1500);
