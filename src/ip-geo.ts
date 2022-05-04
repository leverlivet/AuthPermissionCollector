import { lookup } from 'geoip-lite';

const licenseKey = 'RqDbfvMbImyt6W1L';

function getGeos() {
  const ip = '65.9.50.69';
  const geo = lookup(ip);
  console.log(geo);
}

getGeos();