import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

export const utils = {
  debounce,

  error(msg, timeout = 1500) {
    Notify.failure(msg, { timeout });
  },

  info(msg, timeout = 1500) {
    Notify.info(msg, { timeout });
  },
};

const REQUIRED_FIELDS = 'name,capital,population,flags,languages';
const target = {
  base: 'https://restcountries.com',
  apiVer: 'v3.1',
  resName: 'name',
};

export const fetchCountries = (name, fields = REQUIRED_FIELDS) => {
  const byName = `${target.base}/${target.apiVer}/${target.resName}/${name}${
    fields ? `?fields=${fields}` : ''
  }`;

  return fetch(byName).then(resp =>
    resp.ok ? resp.json() : Promise.reject(resp)
  );
};
