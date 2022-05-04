import { readFileSync, writeFileSync } from 'fs';
import { SiteData } from './types';

function filter() {
  const lines = readFileSync('sites/combined.csv', 'utf-8')
    .split('\n')
    .filter(Boolean);

  const data: SiteData[] = JSON.parse(readFileSync('data/permissions.json', 'utf-8'));

  const visitedDomains = data.reduce<Record<string, true | undefined>>((map, d) => {
    map[d.domain] = true;
    return map;
  }, {});

  const filteredLines = lines.filter(line => visitedDomains[line.split(',')[0]] !== true);

  writeFileSync('sites/combined.csv', filteredLines.join('\n'));
}

filter();