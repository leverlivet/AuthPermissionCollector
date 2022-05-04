import { closeSync, createWriteStream, existsSync, mkdirSync, openSync } from 'fs';
import { WebElement } from 'selenium-webdriver';
import { formatDate } from './util';
import { instanceIds } from './constants';

const logFolder = 'log';

const getFileName = (id: string) => `${id}_log_${formatDate(new Date())}.txt`;

if (!existsSync(logFolder)) {
  mkdirSync(logFolder);
}

instanceIds.forEach(id => {
  if (!existsSync(logFolder + '/' + getFileName(id))) {
    closeSync(openSync(logFolder + '/' + getFileName(id), 'w'));
  }
});

const logStreams = instanceIds.map(id => ({ id, stream: createWriteStream(logFolder + '/' + getFileName(id), { flags: 'a' }) }));

export const log = (title: string, id: string) => {
  const stream = logStreams.find(s => s.id === id);
  if (!stream) return;
  stream.stream.write((new Date()).getTime() + ', ' + title + '\n');
};

export async function logElement(element: WebElement, instanceId: string, title?: string) {
  if (title) {
    log(title, instanceId);
  }

  try {
    const className = await element.getAttribute('class');
    const tagName = await element.getTagName();
    const text = await element.getText();
    const id = await element.getAttribute('id');
    const href = await element.getAttribute('href');

    log(JSON.stringify({
      id,
      class: className,
      tagName,
      text,
      href,
    }), instanceId);
  } catch {
    log('Could not log element', instanceId)
  }
}

export async function logElements(elements: WebElement[], id: string, title: string) {
  log('ELEMENTS: ' + title, id);
  if (elements.length === 0) log('empty', id);
  for (let element of elements) {
    await logElement(element, id);
  }
}
