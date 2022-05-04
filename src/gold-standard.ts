import { readFileSync, writeFile } from 'fs';
import { GoldStandard, SiteData } from './types';

function createGold() {
  const lines = readFileSync('gold.csv', 'utf-8')
    .split('\n')
    .filter(Boolean);

  const sites: GoldStandard[] = [];

  lines.splice(1).forEach(line => {
    const columns = line.split(',');
    sites.push({
      domain: columns[1],
      google: columns[2].includes('1'),
      apple: columns[3].includes('1'),
      facebook: columns[4].includes('1'),
      twitter: columns[5].includes('1')
    });
  });

  writeFile('top250gold.json', JSON.stringify(sites), function (err: any) {
    if (err) {
      console.log(err);
    }
  });
}

function compare(gold: boolean, site: boolean) {
  if (gold && site) {
    return 'truePos';
  }
  if (gold && !site) {
    return 'falseNeg'
  }
  if (!gold && site) {
    return 'falsePos'
  }

  return 'trueNeg';
}

function compareToGold(file: string) {
  const goldData: GoldStandard[] = JSON.parse(readFileSync('top250gold.json', 'utf-8'));
  const compareData: SiteData[] = JSON.parse(readFileSync(file, 'utf-8'));

  const apple = {
    falseNeg: 0,
    trueNeg: 0,
    truePos: 0,
    falsePos: 0,
    maxElIndex: -1,
    maxFrameindex: -1
  }
  const google = {
    falseNeg: 0,
    trueNeg: 0,
    truePos: 0,
    falsePos: 0,
    maxElIndex: -1,
    maxFrameindex: -1
  }
  const facebook = {
    falseNeg: 0,
    trueNeg: 0,
    truePos: 0,
    falsePos: 0,
    maxElIndex: -1,
    maxFrameindex: -1
  }
  const twitter = {
    falseNeg: 0,
    trueNeg: 0,
    truePos: 0,
    falsePos: 0,
    maxElIndex: -1,
    maxFrameindex: -1
  }

  let maxIdpFoundTime = 0;
  let maxLoginButtonIndex = -1;

  const domains: any[] = [];
  const iframes: any[] = [];
  const ips: any[] = [];

  goldData.forEach(gold => {
    const site = compareData.find(s => s.domain === gold.domain);

    const appleResult = compare(gold.apple, !!site?.idp.apple);
    const googleResult = compare(gold.google, !!site?.idp.google);
    const facebookResult = compare(gold.facebook, !!site?.idp.facebook);
    const twitterResult = compare(gold.twitter, !!site?.idp.twitter);

    apple[appleResult] += 1;
    google[googleResult] += 1;
    facebook[facebookResult] += 1;
    twitter[twitterResult] += 1;

    if (site && Object.values(site.ipAddresses).length < 2) {
      ips.push({ domain: site.domain, ips: site.ipAddresses });
    }

    if (!!site?.idp.apple) {
      if (site.idp.apple.frameIndex > apple.maxFrameindex) {
        apple.maxFrameindex = site.idp.apple.frameIndex;
      }
      if (site.idp.apple.elementIndex > apple.maxElIndex) {
        apple.maxElIndex = site.idp.apple.elementIndex;
      }
      if (site.idp.apple.timeStamp - site.startTime > maxIdpFoundTime) {
        maxIdpFoundTime = site.idp.apple.timeStamp - site.startTime;
      }
      if (site.idp.apple.frameIndex !== -1) {
        iframes.push({
          domain: site.domain,
          frameIndex: site.idp.apple.frameIndex,
          onHomePage: site.idp.apple.buttonOnHomePage,
          loginClicked: site.idp.apple.buttonFoundAfterLoginClick
        });
      }
    }

    if (!!site?.idp.facebook) {
      if (site.idp.facebook.frameIndex > facebook.maxFrameindex) {
        facebook.maxFrameindex = site.idp.facebook.frameIndex;
      }
      if (site.idp.facebook.elementIndex > facebook.maxElIndex) {
        facebook.maxElIndex = site.idp.facebook.elementIndex;
      }
      if (site.idp.facebook.timeStamp - site.startTime > maxIdpFoundTime) {
        maxIdpFoundTime = site.idp.facebook.timeStamp - site.startTime;
      }
      if (site.idp.facebook.frameIndex !== -1) {
        iframes.push({
          domain: site.domain,
          frameIndex: site.idp.facebook.frameIndex,
          onHomePage: site.idp.facebook.buttonOnHomePage,
          loginClicked: site.idp.facebook.buttonFoundAfterLoginClick
        });
      }
    }

    if (!!site?.idp.google) {
      if (site.idp.google.frameIndex > google.maxFrameindex) {
        google.maxFrameindex = site.idp.google.frameIndex;
      }
      if (site.idp.google.elementIndex > google.maxElIndex) {
        google.maxElIndex = site.idp.google.elementIndex;
      }
      if (site.idp.google.timeStamp - site.startTime > maxIdpFoundTime) {
        maxIdpFoundTime = site.idp.google.timeStamp - site.startTime;
      }
      if (site.idp.google.frameIndex !== -1) {
        iframes.push({
          domain: site.domain,
          frameIndex: site.idp.google.frameIndex,
          onHomePage: site.idp.google.buttonOnHomePage,
          loginClicked: site.idp.google.buttonFoundAfterLoginClick
        });
      }
    }

    if (!!site?.idp.twitter) {
      if (site.idp.twitter.frameIndex > twitter.maxFrameindex) {
        twitter.maxFrameindex = site.idp.twitter.frameIndex;
      }
      if (site.idp.twitter.elementIndex > twitter.maxElIndex) {
        twitter.maxElIndex = site.idp.twitter.elementIndex;
      }
      if (site.idp.twitter.timeStamp - site.startTime > maxIdpFoundTime) {
        maxIdpFoundTime = site.idp.twitter.timeStamp - site.startTime;
      }
      if (site.idp.twitter.frameIndex !== -1) {
        iframes.push({
          domain: site.domain,
          frameIndex: site.idp.twitter.frameIndex,
          onHomePage: site.idp.twitter.buttonOnHomePage,
          loginClicked: site.idp.twitter.buttonFoundAfterLoginClick
        });
      }
    }

    const domain = {
      domain: gold.domain,
      falseNeg: 0,
      falsePos: 0,
      trueNeg: 0,
      truePos: 0,
    }

    domain[appleResult] += 1;
    domain[googleResult] += 1;
    domain[facebookResult] += 1;
    domain[twitterResult] += 1;

    if (domain.falseNeg > 0 || domain.falsePos) {
      domains.push(domain);
    }

    if (site && site.loginElementIndexOnIdpFound > maxLoginButtonIndex) {
      maxLoginButtonIndex = site.loginElementIndexOnIdpFound;
    }
  });

  const all = [apple, google, facebook, twitter].reduce((tot, idp) => {
    tot.falseNeg += idp.falseNeg;
    tot.trueNeg += idp.trueNeg;
    tot.truePos += idp.truePos;
    tot.falsePos += idp.falsePos;

    return tot;
  },
    {
      falseNeg: 0,
      trueNeg: 0,
      truePos: 0,
      falsePos: 0,
    }
  );

  const totMilliSeconds = compareData[compareData.length - 1].endTime - compareData[0].startTime
  const hours = Math.floor(totMilliSeconds / 3600000);
  const minutes = Math.floor((totMilliSeconds % 3600000) / 60000);
  const secounds = Math.floor((totMilliSeconds % 60000) / 1000);

  // console.log('Domains failed: ', domains);
  console.log('Apple: ', apple);
  console.log('Google: ', google);
  console.log('Facebook: ', facebook);
  console.log('Twitter: ', twitter);

  compareData.sort((a, b) => (a.endTime - a.startTime) - (b.endTime - b.startTime)).forEach(page => {
    console.log(`${page.domain}: ${Math.floor((page.endTime - page.startTime) / 60000)} minutes`);
  })

  const idps = [{ ...apple, idp: 'apple' }, { ...facebook, idp: 'facebook' }, { ...google, idp: 'google' }, { ...twitter, idp: 'twitter' }];
  idps.forEach((idp) => {
    console.log(`${idp.idp} Accuracy: ${(idp.truePos + idp.trueNeg) / (idp.truePos + idp.trueNeg + idp.falsePos + idp.falseNeg)}`);
    console.log(`${idp.idp} Precision: ${idp.truePos / (idp.truePos + idp.falsePos)}`);
    console.log(`${idp.idp} Recall: ${idp.truePos / (idp.truePos + idp.falseNeg)}`);
  });

  console.log(`MaxLoginButtonIndex: ${maxLoginButtonIndex}`);
  console.log(`MaxIdpFoundTime: ${Math.floor(maxIdpFoundTime / 60000)} minutes, ${Math.floor((maxIdpFoundTime % 60000) / 1000)} seconds`);
  console.log(`Time: ${hours} hours, ${minutes} minutes, ${secounds} seconds`);
  console.log(`Accuracy: ${(all.truePos + all.trueNeg) / (all.truePos + all.trueNeg + all.falsePos + all.falseNeg)}`);
  console.log(`Precision: ${all.truePos / (all.truePos + all.falsePos)}`);
  console.log(`Recall: ${all.truePos / (all.truePos + all.falseNeg)}`);

  // console.log(iframes);
  // console.log(ips);
  console.log(all);
}

compareToGold('data/permissions.json');
// createGold();