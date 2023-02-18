import './css/styles.css';
import { fetchCountries, utils } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const SEARCH_RESULT_LIMIT = 10;
const MSG_SEARCH_LIMIT_REACHED = 'Please, enter a more specific name.';
const ERR_COUNTRY_NOT_FOUND = 'Oops, there is no country with that name.';

const searchBoxRef = document.querySelector('#search-box');
const countryInfoRef = document.querySelector('.country-info');
const countryListRef = document.querySelector('.country-list');

searchBoxRef.addEventListener(
  'input',
  utils.debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput({ target: el }) {
  const name = el.value.trim();
  if (!name) return clearAllCountryInfo();

  fetchCountries(name).then(onFulfilled).catch(onRejected);
}

function onRejected(reason) {
  clearAllCountryInfo();

  if (reason instanceof Error) throw new Error(reason);

  utils.error(
    reason.status === 404
      ? ERR_COUNTRY_NOT_FOUND
      : `${reason.status} (${reason.statusText})`
  );
}

function onFulfilled(data) {
  clearAllCountryInfo();

  if (data.length >= SEARCH_RESULT_LIMIT)
    return utils.info(MSG_SEARCH_LIMIT_REACHED);

  return data.length === 1 ? renderCountryInfo(data) : renderCountryList(data);
}

function renderCountryList(data = []) {
  countryListRef.innerHTML = data
    .map(
      ({ name, flags }) =>
        `<li class="country-list__item">
            <img class="country-list__flag" src=${flags.svg} width="20" alt="state flag">
            ${name.official}
        </li>`
    )
    .join('');
}

function renderCountryInfo(data = []) {
  const [{ name, flags, capital, population, languages }] = data;

  countryInfoRef.innerHTML = `
    <h2 class="country-info__title">
        <img class="country-info__flag" src=${
          flags.svg
        } width="20" alt="state flag">${name.official}
    </h2>
    <ul class="country-info__list">
        <li><b>Capital</b>: ${capital}</li>
        <li><b>Population</b>: ${population}</li>
        <li><b>Languages</b>: ${Object.values(languages).join(', ')}</li>
    </ul>`;
}

function clearAllCountryInfo() {
  countryInfoRef.innerHTML = countryListRef.innerHTML = '';
}
