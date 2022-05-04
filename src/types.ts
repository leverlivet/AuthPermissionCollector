import { IRectangle } from 'selenium-webdriver';

export interface CallBackResult {
  pageWasRefreshed?: boolean;
  stop?: boolean;
}

export interface IdpInfo {
  url: string;
  timeStamp: number;
  buttonOnHomePage: boolean;
  buttonInIframe: boolean;
  buttonFoundAfterLoginClick: boolean;
  openedNewWindow: boolean;
  frameIndex: number;
  elementIndex: number;
  totIndex: number;
  twitterPermissions?: string;
}

export interface IdpStats {
  framesSearched: number;
  elementsSearched: number;
  elementsRedirected: number;
  elementsNewWindows: number;
  timeSpent: number;
}

export interface SiteData {
  domain: string;
  url: string;
  instance: string;
  couldNotLoad: boolean;
  timedOut: boolean;
  crashed: boolean;
  sslSuccess: boolean;
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
}

export interface GoldStandard {
  domain: string;
  apple: boolean;
  facebook: boolean;
  google: boolean;
  twitter: boolean;
}

export interface SerializedWebElement {
  rect: IRectangle;
  tagName: string;
  href: string;
  class: string;
  id: string;
}