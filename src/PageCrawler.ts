import { until, WebDriver } from 'selenium-webdriver';
import { getIdpOauthUrl, IDP } from './constants';
import { savePageSource, writeData } from './file-writer';
import { log } from './logger';
import { getCertificate, getNetworkEntries, getTLSVersion, lookUpIp } from './site-info';
import { IdpInfo, IdpStats, SerializedWebElement } from './types';
import { clickElement, forEachElement, getConsentButtons, getConsentIframes, getIdpButtons, getIdpIframes, getLoginButtons, getTwitterPermissions, serializeElement } from './util';

export class PageCrawler {
  driver: WebDriver;
  id: string;
  couldNotLoad: boolean;
  timedOut: boolean;
  crashed: boolean;
  sslSuccess: boolean;

  domain: string;

  url: string;
  startTime: number;
  endTime: number;
  closePopupsStartTime: number;
  closePopupsEndTime: number;
  loginButtonStartTime: number;
  loginButtonEndTime: number;
  loginButtonIdpTimeSpent: number;

  ipAddresses: Record<string, string>;
  tls: Record<string, boolean | null>;

  idp: {
    apple: IdpInfo | null;
    facebook: IdpInfo | null;
    google: IdpInfo | null;
    twitter: IdpInfo | null;
  }

  cookiesFramesSearched: number;
  cookiesElementsSearched: number;
  cookiesElementsRedirected: number;
  cookiesElementsNewWindows: number;

  loginElementsSearched: number;
  loginElementsRedirected: number;
  loginElementsNewWindows: number;
  loginElementIndexOnIdpFound: number;

  idpStats: {
    apple: IdpStats;
    facebook: IdpStats;
    google: IdpStats;
    twitter: IdpStats;
  }

  idpElementsClicked: {
    apple: SerializedWebElement[];
    facebook: SerializedWebElement[];
    google: SerializedWebElement[];
    twitter: SerializedWebElement[];
  }
  urlsVisited: string[];

  constructor(driver: WebDriver, url: string, id: string) {
    const match = url.match(/(?<=:\/\/)[\w\.-]+/);
    this.domain = match ? match[0] : '';

    this.couldNotLoad = true;
    this.timedOut = false;
    this.crashed = false;
    this.sslSuccess = false;
    this.id = id;
    this.driver = driver;
    this.url = url;
    this.startTime = -1;
    this.endTime = -1;
    this.closePopupsStartTime = -1;
    this.closePopupsEndTime = -1;
    this.loginButtonStartTime = -1;
    this.loginButtonEndTime = -1;
    this.loginButtonIdpTimeSpent = 0;

    this.ipAddresses = {};
    this.tls = {};

    this.idp = {
      apple: null,
      facebook: null,
      google: null,
      twitter: null
    };

    this.cookiesFramesSearched = 0;
    this.cookiesElementsSearched = 0;
    this.cookiesElementsRedirected = 0;
    this.cookiesElementsNewWindows = 0;

    this.loginElementsSearched = 0;
    this.loginElementsRedirected = 0;
    this.loginElementsNewWindows = 0;
    this.loginElementIndexOnIdpFound = -1;

    this.idpStats = Object.values(IDP).reduce((obj, idp) => {
      return {
        ...obj, [idp]: {
          framesSearched: 0,
          elementsSearched: 0,
          elementsRedirected: 0,
          elementsNewWindows: 0,
          timeSpent: 0
        }
      };
    }, {}) as any;

    this.idpElementsClicked = {
      apple: [],
      facebook: [],
      google: [],
      twitter: []
    };

    this.urlsVisited = [];

  }

  async run() {
    this.startTime = (new Date()).getTime();
    log('-------------------------------', this.id);
    log('STARTING: ' + this.url, this.id);
    log('-------------------------------', this.id);


    await this.crawl();

    this.endTime = (new Date()).getTime();
    if (this.endTime - this.startTime > 1200000) {
      this.timedOut = true;
    }
    this.saveData();
  }

  async crawl() {
    this.ipAddresses[this.url] = await lookUpIp(this.url, this.id);

    try {
      await this.driver.get(this.url);
      this.couldNotLoad = false;
    } catch (err) {
      log('ERROR load page: ' + err.toString(), this.id);
    }

    try {
      await getNetworkEntries(this.driver, this.url, this.domain);

      try {
        await this.closeCookiesPopUp();
      } catch (err) {
        log('ERROR closeCookiesPopUp: ' + err.toString(), this.id);
      }

      let url = await this.driver.getCurrentUrl()
      if (url[url.length - 1] === '/') {
        url = url.substring(0, url.length - 1);
      }
      this.ipAddresses[url] = await lookUpIp(url, this.id);

      this.tls = await getTLSVersion(url, this.id);
      this.sslSuccess = await getCertificate(url, this.domain, this.id);

      savePageSource(await this.driver.getPageSource(), this.domain);

      await this.searchForIdpButtons(true, false);

      if (Object.values(this.idp).some(idp => idp === null)) {
        await this.searchForLoginButtons();
      }
    } catch (err) {
      log('ERROR crawl: ' + err.toString(), this.id);
      this.crashed = true;
    }
  }

  async closeCookiesPopUp() {
    this.closePopupsStartTime = (new Date()).getTime();
    await new Promise(resolve => setTimeout(resolve, 3000));

    log('\nTRYING TO CLOSE POPUPS START\n', this.id);

    this.cookiesFramesSearched = await forEachElement(
      this.driver,
      getConsentIframes,
      getConsentButtons,
      { id: this.id },
      async ({ element }) => {
        if ((new Date()).getTime() - this.startTime > 1200000) {
          return true;
        }

        this.cookiesElementsSearched++;
        let originalUrl = '';
        let originalWindow = '';
        try {
          originalUrl = await this.driver.getCurrentUrl();
          originalWindow = await this.driver.getWindowHandle();

          await clickElement(element, this.id, {});

        } catch (err) {
          log('ERROR closeCookiesPopUp: ' + err.toString(), this.id);
        } finally {
          this.cookiesElementsNewWindows += await this.closeExtraWindows(originalWindow);

          if (originalUrl !== await this.driver.getCurrentUrl()) {
            this.cookiesElementsRedirected++;
            await this.driver.get(originalUrl);
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }
    );

    await this.driver.get(this.url);
    this.closePopupsEndTime = (new Date()).getTime();

    log('\nTRYING TO CLOSE POPUPS END\n', this.id);
  }

  async searchForLoginButtons() {
    this.loginButtonStartTime = (new Date()).getTime();
    await new Promise(resolve => setTimeout(resolve, 3000));

    log('\nFINDING LOGIN BUTTONS START\n', this.id);

    await forEachElement(
      this.driver,
      async () => [],
      getLoginButtons,
      { id: this.id, maxElements: 15 },
      async ({ element, elementIndex }) => {
        if ((new Date()).getTime() - this.startTime > 1200000) {
          return true;
        }

        this.loginElementsSearched++;
        let originalUrl = '';
        let originalWindow = '';
        let newUrl = '';
        let idpFound = false;
        try {
          originalUrl = await this.driver.getCurrentUrl();
          originalWindow = await this.driver.getWindowHandle();
          const prevSource = await this.driver.getPageSource();

          await clickElement(element, this.id, { visibleTimeout: 500 });

          await new Promise(resolve => setTimeout(resolve, 3000));
          newUrl = await this.driver.getCurrentUrl();

          const newWindow = (await this.driver.getAllWindowHandles()).find(w => w !== originalWindow);
          if (newWindow) {
            await this.driver.switchTo().window(newWindow);
          }

          const urlIsVisited = originalUrl !== newUrl && this.urlsVisited.includes(newUrl);

          if (!urlIsVisited || prevSource !== await this.driver.getPageSource()) {
            const start = (new Date()).getTime();
            idpFound = await this.searchForIdpButtons(originalUrl === newUrl && !newWindow, true, originalUrl !== newUrl ? undefined : elementIndex);
            this.loginButtonIdpTimeSpent += ((new Date()).getTime() - start);
          }

        } catch (err) {
          log('ERROR searchForLoginButtons: ' + err.toString(), this.id);
        } finally {

          this.loginElementsNewWindows += await this.closeExtraWindows(originalWindow);

          if (originalUrl !== newUrl) {
            this.urlsVisited.push(newUrl);
            this.loginElementsRedirected++;
            await this.driver.get(originalUrl);
          }

          if (idpFound) {
            this.loginElementIndexOnIdpFound = elementIndex;
            return true;
          }
        }
      }
    );

    log('\nFINDING LOGIN BUTTONS END\n', this.id);

    this.loginButtonEndTime = (new Date()).getTime();
  }

  async searchForIdpButtons(onHomeScreen: boolean, afterLoginCLick: boolean, loginButtonIndex?: number) {

    log('\nFINDING IDP BUTTONS START\n', this.id);
    let foundIdp = false;

    for (const idp of Object.values(IDP)) {
      if (this.idp[idp] !== null) {
        continue;
      }

      const startTime = (new Date()).getTime();

      if (startTime - this.startTime > 1200000) {
        return true;
      }

      log(`\nFINDING ${idp} BUTTONS START\n`, this.id);

      this.idpStats[idp].framesSearched += await forEachElement(
        this.driver,
        afterLoginCLick ? getIdpIframes : async () => [],
        getIdpButtons(idp),
        { id: this.id, maxElements: 10, exclude: this.idpElementsClicked[idp] },
        async ({ element, inIframe, elementIndex, frameIndex, index }) => {
          if ((new Date()).getTime() - this.startTime > 1200000) {
            return true;
          }

          this.idpStats[idp].elementsSearched++;
          try {
            const originalUrl = await this.driver.getCurrentUrl();
            const originalWindow = await this.driver.getWindowHandle();
            const allWindows = await this.driver.getAllWindowHandles();
            const originalWindows = [originalWindow, ...allWindows];

            const serializedElement = await serializeElement(element);
            await clickElement(element, this.id, { visibleTimeout: 500 });

            this.idpElementsClicked[idp].push(serializedElement);

            const found = await this.checkIfIdpUrl(originalWindows, idp, onHomeScreen, afterLoginCLick, inIframe, elementIndex, frameIndex, index);

            if (originalUrl !== await this.driver.getCurrentUrl()) {
              this.idpStats[idp].elementsRedirected++;
              await this.driver.get(originalUrl);

              if (typeof loginButtonIndex !== 'undefined') {
                // will also need iframe locator if iframes is checked in searchForLoginButtons
                await clickElement((await getLoginButtons(this.driver))[loginButtonIndex], this.id, { visibleTimeout: 500 });
              }
              await new Promise(resolve => setTimeout(resolve, 3000));
            }

            if (found) {
              foundIdp = true;
              return true;
            }
          } catch (err) {
            log('ERROR searchForIdpButtons: ' + err.toString(), this.id);
          }
        }
      );

      log(`\nFINDING ${idp} BUTTONS END\n`, this.id);

      this.idpStats[idp].timeSpent += ((new Date()).getTime() - startTime);
    }

    log('\nFINDING IDP BUTTONS END\n', this.id);

    return foundIdp;

  }

  async checkIfIdpUrl(originalWindows: string[], idp: IDP, onHomeScreen: boolean, afterLoginCLick: boolean, buttonInIframe: boolean, elementIndex: number, frameIndex: number, totIndex: number) {
    let newWindow: string | undefined = '';
    let idpFound = false;
    try {
      // wait for potential popup window
      await new Promise(resolve => setTimeout(resolve, 1000));

      newWindow = (await this.driver.getAllWindowHandles()).find(w => !originalWindows.includes(w));
      if (newWindow) {
        this.idpStats[idp].elementsNewWindows++;
        await this.driver.switchTo().window(newWindow);
      }

      try {
        await this.driver.wait(until.urlContains(getIdpOauthUrl(idp)), 5000);
      } catch (err) {

      }

      const idpUrl = await this.driver.getCurrentUrl();
      log(`URL ${idp}: ${idpUrl}`, this.id);

      if (idp === IDP.Twitter) {
        if (idpUrl.includes(getIdpOauthUrl(idp)) && idpUrl.includes('oauth_token')) {
          const permissions = await getTwitterPermissions(this.driver, this.id);

          this.idp[idp] = {
            timeStamp: (new Date()).getTime(),
            url: idpUrl,
            twitterPermissions: permissions,
            buttonFoundAfterLoginClick: afterLoginCLick,
            buttonInIframe: buttonInIframe,
            buttonOnHomePage: onHomeScreen,
            elementIndex,
            frameIndex,
            totIndex,
            openedNewWindow: !!newWindow
          };
          idpFound = true;
        }
      } else {
        if (idpUrl.includes(getIdpOauthUrl(idp)) && idpUrl.includes('client_id') && (idp !== IDP.Facebook || idpUrl.includes('oauth'))) {
          this.idp[idp] = {
            timeStamp: (new Date()).getTime(),
            url: idpUrl,
            buttonFoundAfterLoginClick: afterLoginCLick,
            buttonInIframe: buttonInIframe,
            buttonOnHomePage: onHomeScreen,
            elementIndex,
            frameIndex,
            totIndex,
            openedNewWindow: !!newWindow
          };
          idpFound = true;
        }
      }
    } catch (err) {
      log('ERROR checkIfIdpUrl: ' + err.toString(), this.id);
    }
    if (newWindow) {
      await this.driver.close();
      await this.driver.switchTo().window(originalWindows[0]);
    }

    return idpFound;
  }

  async closeExtraWindows(originalWindow: string) {
    let windowsClosed = 0;
    const windows = await this.driver.getAllWindowHandles();
    if (windows.length > 1) {
      for (const window of windows) {
        if (window !== originalWindow) {
          windowsClosed++;
          await this.driver.switchTo().window(window);
          await this.driver.close();
        }
      }
      await this.driver.switchTo().window(originalWindow);
    }

    return windowsClosed;
  }

  saveData() {
    writeData({
      domain: this.domain,
      url: this.url,
      instance: this.id,
      couldNotLoad: this.couldNotLoad,
      crashed: this.crashed,
      timedOut: this.timedOut,
      sslSuccess: this.sslSuccess,
      startTime: this.startTime,
      endTime: this.endTime,
      closePopupsStartTime: this.closePopupsStartTime,
      closePopupsEndTime: this.closePopupsEndTime,
      loginButtonStartTime: this.loginButtonStartTime,
      loginButtonEndTime: this.loginButtonEndTime,
      loginButtonIdpTimeSpent: this.loginButtonIdpTimeSpent,

      ipAddresses: this.ipAddresses,
      tls: this.tls,

      idp: this.idp,

      cookiesFramesSearched: this.cookiesFramesSearched,
      cookiesElementsSearched: this.cookiesElementsSearched,
      cookiesElementsRedirected: this.cookiesElementsRedirected,
      cookiesElementsNewWindows: this.cookiesElementsNewWindows,

      loginElementsSearched: this.loginElementsSearched,
      loginElementsRedirected: this.loginElementsRedirected,
      loginElementsNewWindows: this.loginElementsNewWindows,
      loginElementIndexOnIdpFound: this.loginElementIndexOnIdpFound,

      idpStats: this.idpStats
    });
  }
}