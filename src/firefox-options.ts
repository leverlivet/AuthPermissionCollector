import { logging } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/firefox';

const language = "en";

const firefoxOptions = new Options();

const logPrefs = new logging.Preferences();
logPrefs.setLevel(logging.Type.PERFORMANCE, logging.Level.DEBUG);

firefoxOptions.setLoggingPrefs(logPrefs);
firefoxOptions.setAcceptInsecureCerts(true);
firefoxOptions.setPreference("intl.accept_languages", language);
firefoxOptions.setPreference("dom.webnotifications.enabled", false);

export default firefoxOptions;