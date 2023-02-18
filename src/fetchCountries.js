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

export const fetchCountries = (
  name,
  fields = 'name,capital,population,flags,languages'
) =>
  fetch(
    `https://restcountries.com/v3.1/name/${name}${
      fields ? `?fields=${fields}` : ''
    }`
  ).then(resp => (resp.ok ? resp.json() : Promise.reject(resp)));
