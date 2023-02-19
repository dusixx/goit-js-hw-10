import './css/styles.css';
import { fetchCountries, utils } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const SEARCH_RESULT_LIMIT = 10;
const MSG_SEARCH_LIMIT_REACHED = 'Please, enter a more specific name.';
const ERR_COUNTRY_NOT_FOUND = 'Oops, there is no country with that name.';

const searchBoxRef = document.querySelector('#search-box');
const countryInfoRef = document.querySelector('.country-info');
const countryListRef = document.querySelector('.country-list');
const clearInputRef = document.querySelector('.clear-input');

searchBoxRef.addEventListener(
  'input',
  utils.debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput({ target: el }) {
  clearAllCountryInfo();

  const name = el.value.trim();
  if (name) fetchCountries(name).then(onFulfilled).catch(onRejected);
}

function onRejected(reason) {
  if (reason instanceof Error) throw new Error(reason);

  utils.error(
    reason.status === 404
      ? ERR_COUNTRY_NOT_FOUND
      : `${reason.status} (${reason.statusText})`
  );
}

function onFulfilled(data) {
  if (data.length >= SEARCH_RESULT_LIMIT)
    return utils.info(MSG_SEARCH_LIMIT_REACHED);

  return data.length === 1 ? renderCountryInfo(data) : renderCountryList(data);
}

function clearAllCountryInfo() {
  countryInfoRef.innerHTML = countryListRef.innerHTML = '';
}

function renderCountryList(data = []) {
  // кешируем данные для выбора из списка без запроса к серверу
  renderCountryList.data = data;

  countryListRef.innerHTML = data
    .map(
      ({ name, flags }, idx) =>
        `<li class="country-list__item">
            <img class="country-list__flag" src=${flags.svg} width="20" alt="state flag">
            <span class="country-list__name" data-idx="${idx}">${name.official}</span>
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
        } width="25" alt="state flag">${name.official}
    </h2>
    <ul class="country-info__list">
        <li><b>Capital</b>: ${capital}</li>
        <li><b>Population</b>: ${population}</li>
        <li><b>Languages</b>: ${Object.values(languages).join(', ')}</li>
    </ul>`;
}

////////////////////////////////
// Доп. функциональность
////////////////////////////////

// очистка поля ввода
clearInputRef.addEventListener('click', () => {
  searchBoxRef.value = '';
  clearAllCountryInfo();
});

// выбор из списка для показа детальной информации
countryListRef.addEventListener('click', ({ target }) => {
  if (target.tagName !== 'SPAN') return;

  const currData = renderCountryList.data[target.dataset.idx];

  clearAllCountryInfo();
  searchBoxRef.value = currData.name.official;
  renderCountryInfo([currData]);
});
