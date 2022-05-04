import { Builder, WebDriver } from 'selenium-webdriver';
import chromeOptions from './chrome-options';
import firefoxOptions from './firefox-options';
import { getUrls } from './csv-reader';
import { PageCrawler } from './PageCrawler';
import { instanceIds } from './constants';
import { log } from './logger';

const urls = getUrls();
let urlIndex = 0;

async function run() {
  await Promise.all(instanceIds.map(id => instance(id)));
};

async function instance(id: string) {
  await new Promise(resolve => setTimeout(resolve, 2000 * +id));

  while (urlIndex < urls.length) {
    try {
      const url = urls[urlIndex++];
      await crawl(url, id);
      console.log(`Instance: ${id}, url: ${url}`);
    } catch (err) {
      log('ERROR instance: ' + err.toString(), id);
    }
  }
};

async function crawl(url: string, id: string) {
  const driver = await new Builder().forBrowser('chrome').withCapabilities(chromeOptions).build();
  await driver.manage().setTimeouts({ implicit: 2000, pageLoad: 10000 });
  await driver.manage().window().setRect({ height: 1080, width: 1920, y: Math.floor((+id) / 4) * 1080, x: (((+id) % 4) * 1920) - 9000 });

  const crawler = new PageCrawler(driver, url, id);
  await crawler.run();

  await driver.close();
}

run();
