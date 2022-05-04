import ssl from 'get-ssl-certificate';
import dns from 'dns';
import https from 'https';
import { log } from './logger';
import { logging, WebDriver } from 'selenium-webdriver';
import { PerformanceEntry } from 'perf_hooks';
import { writeFileSync, writeFile } from 'fs';
import { savePerformanceEntries } from './file-writer';

export async function getCertificate(fullUrl: string, name: string, id: string) {
  try {
    const match = fullUrl.match(/(?<=:\/\/)[\w\.]+/);
    const url = match ? match[0] : '';

    if (!url) {
      throw new Error(`Could not parse url: ${fullUrl}`);
    }

    const cert = await ssl.get(url, 5000);
    const fileName = name.replace('.', '_');

    const path = `cert/certificates/${fileName}.json`;
    const cert_text = JSON.stringify(cert);

    await fetchCertificate(cert_text, name, id);

    writeFile(path, cert_text, function (err: any) {
      if (err) {
        log('SSL-WRITE-ERROR: ' + err.toString(), id);
      }
    });
    // console.log(JSON.stringify(cert));

  } catch (err) {
    log('SSL-FETCH-ERROR: ' + err.toString(), id);
    return false;
  }
  return true;
}

export async function lookUpIp(fullUrl: string, id: string) {
  const match = fullUrl.match(/(?<=:\/\/)[\w\.]+/);
  const url = match ? match[0] : '';

  let address = '';
  try {
    address = await new Promise<string>((resolve, reject) => {
      if (!url) reject(`Could not parse url: ${fullUrl}`);
      dns.lookup(url, (err, result, family) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  } catch (err) {
    log('IP-ADDRESS-LOOKUP-ERROR: ' + err.toString(), id);
  }

  return address;
}

export async function getTLSVersion(fullUrl: string, id: string) {
  const match = fullUrl.match(/(?<=:\/\/)[\w\.]+/);
  const url = match ? match[0] : '';

  const tlsVersions = ['TLSv1', 'TLSv1.1', 'TLSv1.2', 'TLSv1.3'];
  const supportedVersions: Record<string, boolean | null> = {};

  for (const version of tlsVersions) {

    const options: https.RequestOptions = {
      hostname: url,
      port: 443,
      method: 'GET',
      minVersion: version as any,
      maxVersion: version as any,
      timeout: 5000
    }

    try {
      const success = await new Promise<boolean>((resolve, reject) => {
        const request = https.request(options, res => {
          res.on('data', () => { });
          res.on('end', () => {
            resolve(true);
          });
        })

        request.on('error', err => {
          if (err.toString().includes('SSL alert number') || err.toString().includes('ECONNRESET')) {
            resolve(false);
          } else {
            // console.log(version, err);
            reject(err);
          }
        })

        request.on('timeout', () => {
          request.destroy();
          reject('timeout');
        })

        request.end();
      });

      supportedVersions[version] = success;

    } catch (err) {
      supportedVersions[version] = null;
      log(`${version}-LOOKUP-ERROR: ${err.toString()}`, id);
    }
  }
  return supportedVersions;
}

export async function getNetworkEntries(driver: WebDriver, url: string, name: string) {

  // await driver.executeScript("window.performance.clearResourceTimings();");
  // await driver.get(url);
  // const entries: PerformanceEntry[] = await driver.executeScript("return window.performance.getEntriesByType('resource');");
  //const entries: PerformanceEntry[] = await driver.executeScript("return window.performance.getEntries();");
  const logs = await driver.manage().logs().get(logging.Type.PERFORMANCE);

  const data = [];
  for (const perf of logs) {
    perf.message = JSON.parse(perf.message);
    data.push(perf);
  }

  savePerformanceEntries(JSON.stringify(data), name);
}

async function fetchCertificate(certificateText: string, name: string, id: string) {

  const foundCert = certificateText.toString().match(/(?<="pemEncoded":).*(?=)/g)!;
  const removeCharacters = foundCert.toString().replace(/(\n)|"|}/g, '')!;

  const removeBegin = removeCharacters.toString().replace('-----BEGIN CERTIFICATE-----', '')!;
  const removeEnd = removeBegin.toString().replace('-----END CERTIFICATE-----', '')!;
  const finalCert = '-----BEGIN CERTIFICATE-----\n' + removeEnd + '\n-----END CERTIFICATE-----';

  const fileName = name.replace('.', '_');

  const path = `cert/pem-encoded/${fileName}.crt`;


  writeFile(path, finalCert, function (err: any) {
    if (err) {
      log(`FETCH-CERTIFICATE-ERROR: ${err.toString()}`, id);
    }
  });
}

async function test() {
  const versions = await getTLSVersion('https://ruiframe.ru', '-1');
  console.log(versions);
}

test();