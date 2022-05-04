import { readFileSync } from 'fs';

function union() {
  const lines = readFileSync('ruban.csv', 'utf-8')
    .split('\n')
    .filter(Boolean);

  const alexaLines = readFileSync('alexa-top1m.csv', 'utf-8')
    .split('\n')
    .filter(Boolean);

  const printedUrls: string[] = [];

  lines.forEach(line => {
    const url = line.split(',')[0];
    if (!printedUrls.includes(url)) {
      const rank = alexaLines.find(l => l.split(',')[1] === url)?.split(',')[0] || 0;

      console.log(rank);
      printedUrls.push(url);
    }
  });
  console.log('............................................................');
  const newUrls: string[] = [];
  alexaLines.slice(0, 200).forEach(line => {
    const url = line.split(',')[1];

    if (!printedUrls.includes(url)) {
      console.log(line.split(',')[0]);
      newUrls.push(url);
    }
  });

  console.log(newUrls);
}

union();