export const instanceIds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

export const buttonNames = {
  login: ['login', 'signin', 'profile', 'account'],
  cookies: ['accept', 'approve', 'agree', 'continue', 'close', 'consent', 'ok', 'yes', 'gotit'],
  apple: ['apple'],
  facebook: ['facebook'],
  google: ['google'],
  twitter: ['twitter']
}

export enum IDP {
  Twitter = 'twitter',
  Apple = 'apple',
  Facebook = 'facebook',
  Google = 'google',
}

export const OauthUrl = {
  apple: 'appleid.apple.com/auth/authorize',
  facebook: 'facebook.com/login',
  google: 'accounts.google.com',
  twitter: 'api.twitter.com/oauth/auth'
}

export const OauthRegex = new RegExp('appleid\.apple\.com\/auth\/authorize|facebook\.com\/login|accounts\.google\.com\/o\/oauth|api\.twitter\.com\/oauth\/authorize')

export const getIdpButtonNames = (idp: IDP) => {
  switch (idp) {
    case IDP.Apple:
      return buttonNames.apple;
    case IDP.Facebook:
      return buttonNames.facebook;
    case IDP.Google:
      return buttonNames.google;
    case IDP.Twitter:
      return buttonNames.twitter;
    default:
      return [];
  }
};

export const getIdpOauthUrl = (idp: IDP) => {
  switch (idp) {
    case IDP.Apple:
      return OauthUrl.apple;
    case IDP.Facebook:
      return OauthUrl.facebook;
    case IDP.Google:
      return OauthUrl.google;
    case IDP.Twitter:
      return OauthUrl.twitter;
    default:
      return '';
  }
};