import { logging } from 'selenium-webdriver';
import { Options, IPerfLoggingPrefs } from 'selenium-webdriver/chrome';

const language = "en";

const options = new Options();

// options.addArguments("--incognito");
options.addArguments(`--lang=${language}`);
options.addArguments("--disable-notifications");
options.addArguments("enable-automation");
options.addArguments("--disable-infobars");
options.addArguments("--mute-audio");
// options.addArguments("--start-maximized");
options.addArguments("--window-size=600,400");
options.addArguments("--force-device-scale-factor=0.2");

// options.addArguments("--enable-features=NetworkService,NetworkServiceInProcess");
// options.addArguments("--headless");
// options.addArguments("--disable-gpu");
// options.addArguments("--window-size=1920,1080");

const logPrefs = new logging.Preferences();
logPrefs.setLevel(logging.Type.PERFORMANCE, logging.Level.DEBUG);
options.setLoggingPrefs(logPrefs);

options.setUserPreferences({
  "partition": {
    // "default_zoom_level": { "x": -3.8017840169239308 }
  },
  "translate_whitelists": {
    "af": language,
    "sq": language,
    "am": language,
    "ar": language,
    "hy": language,
    "az": language,
    "eu": language,
    "be": language,
    "bn": language,
    "bs": language,
    "bg": language,
    "ca": language,
    "ceb": language,
    "zh-CN": language,
    "zh": language,
    "zh-TW": language,
    "co": language,
    "hr": language,
    "cs": language,
    "da": language,
    "nl": language,
    "en": language,
    "eo": language,
    "et": language,
    "fi": language,
    "fr": language,
    "fy": language,
    "gl": language,
    "ka": language,
    "de": language,
    "el": language,
    "gu": language,
    "ht": language,
    "ha": language,
    "haw": language,
    "he": language,
    "iw": language,
    "hi": language,
    "hmn": language,
    "hu": language,
    "is": language,
    "ig": language,
    "id": language,
    "ga": language,
    "it": language,
    "ja": language,
    "jv": language,
    "kn": language,
    "kk": language,
    "km": language,
    "rw": language,
    "ko": language,
    "ku": language,
    "ky": language,
    "lo": language,
    "la": language,
    "lv": language,
    "lt": language,
    "lb": language,
    "mk": language,
    "mg": language,
    "ms": language,
    "ml": language,
    "mt": language,
    "mi": language,
    "mr": language,
    "mn": language,
    "my": language,
    "ne": language,
    "no": language,
    "ny": language,
    "or": language,
    "ps": language,
    "fa": language,
    "pl": language,
    "pt": language,
    "pa": language,
    "ro": language,
    "ru": language,
    "sm": language,
    "gd": language,
    "sr": language,
    "st": language,
    "sn": language,
    "sd": language,
    "si": language,
    "sk": language,
    "sl": language,
    "so": language,
    "es": language,
    "su": language,
    "sw": language,
    "sv": language,
    "tl": language,
    "tg": language,
    "ta": language,
    "tt": language,
    "te": language,
    "th": language,
    "tr": language,
    "tk": language,
    "uk": language,
    "ur": language,
    "ug": language,
    "uz": language,
    "vi": language,
    "cy": language,
    "xh": language,
    "yi": language,
    "yo": language,
    "zu": language,
  },
  "translate": {
    "enabled": true
  },
  "translate_blocked_languages": [],
  "translate_too_often_denied_for_language": {},
});

export default options;