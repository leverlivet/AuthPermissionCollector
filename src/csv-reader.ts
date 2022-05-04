import fs from 'fs';

// const file = 'sites/test.csv';
// const file = 'sites/majestic_million_top250.csv';
const file = 'sites/combined.csv';

export function getUrls() {
  const lines = fs.readFileSync(file, 'utf-8')
    .split('\n')
    .filter(Boolean);

  const urls: string[] = [];

  lines.forEach(line => {
    const domain = line.split(',')[0];
    // const shouldSkip = line.split(',')[2]?.includes('porn');
    const url = 'https://' + domain;

    //if (!shouldSkip) {
    urls.push(url);
    //}
  });

  return urls;
}