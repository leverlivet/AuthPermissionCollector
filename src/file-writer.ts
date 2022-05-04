import { createWriteStream, writeFile } from 'fs';
import { SiteData } from './types';

const dataFolder = 'data/';

const permissionsFile = 'permissions.json';

const permissionStream = createWriteStream(dataFolder + permissionsFile, { flags: 'a' });
const failedStream = createWriteStream('sites/failed.csv', { flags: 'a' });

export const writeData = (data: SiteData) => {
  permissionStream.write(JSON.stringify(data) + ',\n');
  if (data.crashed) {
    failedStream.write(data.domain + ',\n');
  }
};

export function savePageSource(htmlSource: string, name: string) {
  const fileName = name.replace('.', '_');
  const path = `page-source/${fileName}.html`;

  writeFile(path, htmlSource, function (err: any) {
    if (err) {
      console.log(err);
    }
  });
}

export function savePerformanceEntries(data: string, name: string) {
  const fileName = name.replace('.', '_');
  const path = `perf/${fileName}.json`;

  writeFile(path, data, function (err: any) {
    if (err) {
      console.log(err);
    }
  });
}