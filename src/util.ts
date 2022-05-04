import { format } from 'date-fns';
import { WebElement, until, WebDriver, By } from 'selenium-webdriver';
import { buttonNames, getIdpButtonNames, IDP } from './constants';
import { log, logElement, logElements } from './logger';
import { CallBackResult, SerializedWebElement } from './types';

export function xPathTranslate(valueToTranslate: string) {
  return `translate(${valueToTranslate},'ABCDEFGHIJKLMNOPQRSTUVWXYZ" &#9;&#10;&#13','abcdefghijklmnopqrstuvwxyz')`;
}

export async function clickElement(element: WebElement, id: string, options: { visibleTimeout?: number }) {
  const driver = element.getDriver();
  try {
    if (options.visibleTimeout) {
      await driver.wait(until.elementIsVisible(element), options.visibleTimeout);
    }
    const actions = driver.actions();
    await actions.move({ origin: element }).click().perform();
  } catch (err) {
    throw err;
  }

  // driver.executeAsyncScript("arguments[0].click();", element);
  // await new Promise(resolve => setTimeout(resolve, 2000));
}

export async function serializeElement(element: WebElement): Promise<SerializedWebElement> {
  return {
    class: await element.getAttribute('class'),
    href: await element.getAttribute('href'),
    id: await element.getAttribute('id'),
    rect: await element.getRect(),
    tagName: await element.getTagName()
  };
}

export async function compareElements(el1: SerializedWebElement, el2: SerializedWebElement) {
  return JSON.stringify(el1) === JSON.stringify(el2);
}

export async function getIdpIframes(driver: WebDriver) {
  return await driver.findElements(By.xpath(`//iframe[contains(@src,'login') or contains(@src,'auth') or contains(@src,'client_id')]`));

  //return await driver.findElements(By.css('iframe'));
}

export const getIdpButtons = (idp: IDP) => async (driver: WebDriver) => {
  if (idp === IDP.Apple) {
    return await getAppleButtons(driver);
  }
  if (idp === IDP.Facebook) {
    return await getFacebookButtons(driver);
  }
  if (idp === IDP.Google) {
    return await getGoogleButtons(driver);
  }
  if (idp === IDP.Twitter) {
    return await getTwitterButtons(driver);
  }
  return [];

  /*const buttons: WebElement[] = []

  for (const name of getIdpButtonNames(idp)) {
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('text()')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@title')},'${name}')]`)));
  }

  return await removeDuplicates(buttons);*/
}

export const getAppleButtons = async (driver: WebDriver) => {
  const buttons: WebElement[] = []
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('text()')},'${'apple'}') or contains(${xPathTranslate('@class')},'${'apple'}') or contains(${xPathTranslate('@title')},'${'apple'}') or contains(${xPathTranslate('@href')},'${'apple'}'))]`)));
  /*buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${'apple'}')]`)));
  log('getAppleButtons 2: ' + await driver.getCurrentUrl(), '0')
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@title')},'${'apple'}')]`)));
  log('getAppleButtons 3: ' + await driver.getCurrentUrl(), '0')*/

  /*for (const name of getIdpButtonNames(idp)) {
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('text()')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@title')},'${name}')]`)));
  }*/

  return await removeDuplicates(buttons);
}

export const getGoogleButtons = async (driver: WebDriver) => {
  const buttons: WebElement[] = []
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('text()')},'${'google'}') or contains(${xPathTranslate('@class')},'${'google'}') or contains(${xPathTranslate('@title')},'${'google'}') or contains(${xPathTranslate('@href')},'${'google'}'))]`)));

  /*buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('text()')},'${'google'}')]`)));
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${'google'}')]`)));
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@title')},'${'google'}')]`)));*/

  /*for (const name of getIdpButtonNames(idp)) {
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('text()')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@title')},'${name}')]`)));
  }*/

  return await removeDuplicates(buttons);
}

export const getFacebookButtons = async (driver: WebDriver) => {
  const buttons: WebElement[] = []
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('text()')},'${'facebook'}') or contains(${xPathTranslate('@class')},'${'facebook'}') or contains(${xPathTranslate('@title')},'${'facebook'}') or contains(${xPathTranslate('@href')},'${'facebook'}'))]`)));

  /*buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('text()')},'${'facebook'}')]`)));
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${'facebook'}')]`)));
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@title')},'${'facebook'}')]`)));*/

  /*for (const name of getIdpButtonNames(idp)) {
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('text()')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@title')},'${name}')]`)));
  }*/

  return await removeDuplicates(buttons);
}

export const getTwitterButtons = async (driver: WebDriver) => {
  const buttons: WebElement[] = []
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('text()')},'${'twitter'}') or contains(${xPathTranslate('@class')},'${'twitter'}') or contains(${xPathTranslate('@title')},'${'twitter'}') or contains(${xPathTranslate('@href')},'${'twitter'}'))]`)));

  /*buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('text()')},'${'twitter'}')]`)));
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${'twitter'}')]`)));
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@title')},'${'twitter'}')]`)));*/

  /*for (const name of getIdpButtonNames(idp)) {
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('text()')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@title')},'${name}')]`)));
  }*/

  return await removeDuplicates(buttons);
}

export async function getLoginButtons(driver: WebDriver) {
  const buttons: WebElement[] = []
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('text()')},'${'login'}') or contains(${xPathTranslate('text()')},'${'signin'}') or contains(${xPathTranslate('text()')},'${'profile'}') or contains(${xPathTranslate('text()')},'${'account'}') or contains(${xPathTranslate('@class')},'${'login'}') or contains(${xPathTranslate('@class')},'${'signin'}') or contains(${xPathTranslate('@class')},'${'profile'}') or contains(${xPathTranslate('@class')},'${'account'}') or contains(${xPathTranslate('@href')},'${'login'}') or contains(${xPathTranslate('@href')},'${'signin'}') or contains(${xPathTranslate('@href')},'${'profile'}') or contains(${xPathTranslate('@href')},'${'account'}'))]`)));

  /*buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('text()')},'${'login'}') or contains(${xPathTranslate('text()')},'${'signin'}') or contains(${xPathTranslate('text()')},'${'profile'}') or contains(${xPathTranslate('text()')},'${'account'}'))]`)));
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('@class')},'${'login'}') or contains(${xPathTranslate('@class')},'${'signin'}') or contains(${xPathTranslate('@class')},'${'profile'}') or contains(${xPathTranslate('@class')},'${'account'}'))]`)));
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('@href')},'${'login'}') or contains(${xPathTranslate('@href')},'${'signin'}') or contains(${xPathTranslate('@href')},'${'profile'}') or contains(${xPathTranslate('@href')},'${'account'}'))]`)));*/

  /*for (const name of buttonNames.login) {
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('text()')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${name}')]`)));
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@href')},'${name}')]`)));
  }*/

  return await removeDuplicates(buttons);
}

export async function getConsentIframes(driver: WebDriver) {
  return await driver.findElements(By.css('iframe'));
}

export async function getConsentButtons(driver: WebDriver) {
  const buttons: WebElement[] = []
  //buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('text()')},'${'accept'}') or contains(${xPathTranslate('text()')},'${'approve'}') or contains(${xPathTranslate('text()')},'${'agree'}') or contains(${xPathTranslate('text()')},'${'continue'}') or contains(${xPathTranslate('text()')},'${'consent'}') or contains(${xPathTranslate('@class')},'${'accept'}') or contains(${xPathTranslate('@class')},'${'approve'}') or contains(${xPathTranslate('@class')},'${'agree'}') or contains(${xPathTranslate('@class')},'${'continue'}') or contains(${xPathTranslate('@class')},'${'consent'}') or contains(${xPathTranslate('text()')},'${'close'}') or contains(${xPathTranslate('@class')},'${'close'}'))]`)));

  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('@class')},'${'accept'}') or contains(${xPathTranslate('@class')},'${'approve'}') or contains(${xPathTranslate('@class')},'${'agree'}') or contains(${xPathTranslate('@class')},'${'continue'}') or contains(${xPathTranslate('text()')},'${'accept'}') or contains(${xPathTranslate('text()')},'${'approve'}') or contains(${xPathTranslate('text()')},'${'agree'}') or contains(${xPathTranslate('text()')},'${'continue'}') or contains(${xPathTranslate('text()')},'${'consent'}') or contains(${xPathTranslate('@class')},'${'consent'}'))]`)));
  buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and (contains(${xPathTranslate('@class')},'${'close'}') or contains(${xPathTranslate('text()')},'${'close'}'))]`)));

  /*for (const name of buttonNames.cookies) {
    log('getConsentButtons 0: ' + await driver.getCurrentUrl() + '  ' + name, '0')
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('text()')},'${name}')]`)));
    log('getConsentButtons 1: ' + await driver.getCurrentUrl() + '  ' + name, '0')
    buttons.push(...await driver.findElements(By.xpath(`//body//*[not(self::script) and contains(${xPathTranslate('@class')},'${name}')]`)));
    log('getConsentButtons 2: ' + await driver.getCurrentUrl() + '  ' + name, '0')
  }*/

  return await removeDuplicates(buttons);
}

export async function getTwitterPermissions(driver: WebDriver, id: string) {
  try {
    return await (await driver.findElement(By.xpath(`//*[contains(@class,'permissions') and contains(@class,'allow')]`))).getAttribute('innerHTML');
  } catch (err) {
    log('ERROR TWITTER PERMISSIONS: ' + err.toString(), id);
    return '';
  }
}

interface CallBackFnData {
  element: WebElement;
  inIframe: boolean;
  elementIndex: number;
  frameIndex: number;
  index: number;
}

async function frameHandler(
  driver: WebDriver,
  frameIndex: number,
  iframesCount: number,
  iframeLocator: (driver: WebDriver) => Promise<WebElement[]>
) {
  await driver.switchTo().defaultContent();

  if (frameIndex === -1) {
    await driver.executeScript('window.scrollTo(0,0);');
    return;
  }

  let iframes = await iframeLocator(driver);

  if (iframes.length !== iframesCount) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    iframes = await iframeLocator(driver);
  }

  let iframe = iframes[frameIndex];

  if (iframe) {
    await driver.switchTo().frame(iframe);
  } else {
    throw new Error(`could not locate iframe, frameIndex: ${frameIndex}`);
  }
}

export async function forEachElement(
  driver: WebDriver,
  iframeLocator: (driver: WebDriver) => Promise<WebElement[]>,
  elementLocator: (driver: WebDriver) => Promise<WebElement[]>,
  options: {
    id: string;
    maxElements?: number;
    exclude?: SerializedWebElement[];
  },
  callBackFunction: (data: CallBackFnData) => Promise<boolean | void>,
) {
  const { id, maxElements, exclude = [] } = options;

  await driver.switchTo().defaultContent();
  // log('forEachElement: 0', id);
  let iframes = await iframeLocator(driver);
  const iframesLength = iframes.length;
  // log('forEachElement: 1', id);

  let index = 0;
  for (let frameIndex = -1; frameIndex < iframesLength; frameIndex++) {
    try {
      // log('forEachElement: 2', id);

      await frameHandler(driver, frameIndex, iframesLength, iframeLocator);
      // log('forEachElement: 3', id);

      let elements = await elementLocator(driver);
      const elementsLength = maxElements ? Math.min(maxElements, elements.length) : elements.length;
      // log('forEachElement: 4', id);

      for (let elementIndex = 0; elementIndex < elementsLength; elementIndex++) {
        // log('forEachElement: 5', id);

        await frameHandler(driver, frameIndex, iframesLength, iframeLocator);
        // log('forEachElement: 6', id);

        try {
          elements = await elementLocator(driver);
          // log('forEachElement: 7', id);

          if (elements.length !== elementsLength) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            elements = await elementLocator(driver);
          }
          // log('forEachElement: 8', id);

          // await logElements(elements, `Elements, Frame: ${frameIndex} `);
          // log(await driver.getCurrentUrl());
          const element = elements[elementIndex];

          let skip = false;
          for (const el of exclude) {
            if (await compareElements(el, await serializeElement(element))) {
              skip = true;
              break;
            }
          }

          await logElement(element, id, `Frame: ${frameIndex}, ElementSkipped: ${skip}, Element: `);
          if (skip) {
            continue;
          }

          const stop = await callBackFunction({ element, elementIndex, inIframe: frameIndex !== -1, frameIndex, index });
          // log('forEachElement: 9', id);

          if (stop) {
            return frameIndex + 1;
          }

        } catch (err) {
          log('ERROR forEachElement: ' + err.toString(), id);
        }
        index++;
      }

    } catch (err) {
      log('ERROR forEachFrame: ' + err.toString(), id);
    }
  }

  return iframesLength + 1;
}

export async function removeDuplicates(elements: WebElement[]) {
  const elementsWithId: { el: WebElement, id: string }[] = [];

  for (let i = 0; i < elements.length; i++) {
    const id = await elements[i].getId();
    elementsWithId.push({ id, el: elements[i] });
  }

  return elementsWithId.filter((el, index, array) => index === array.findIndex(el2 => el2.id === el.id)).map(el => el.el);
}

export function formatDate(date: Date) {
  return format(date, 'yyyy-MM-dd_HH-mm');
}