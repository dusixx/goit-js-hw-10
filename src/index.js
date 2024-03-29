import './css/styles.css';
import utils from './js/utils';
import markup from './js/markup';
import refs from './js/refs';
import { fetchCountriesByName as fetchCountries } from './js/rest';
// import getListMarkup from './templates/list.hbs';

const DEBOUNCE_DELAY = 300;
const SEARCH_RESULT_LIMIT = 10;
const MSG_SEARCH_LIMIT_REACHED = 'Please, enter a more specific name.';
const ERR_COUNTRY_NOT_FOUND = 'Oops, there is no country with that name.';

refs.searchInput.addEventListener(
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

  return data.length === 1
    ? renderCountryDetails(data)
    : renderCountryList(data);
}

function clearAllCountryInfo() {
  refs.countryInfo.innerHTML = refs.countryList.innerHTML = '';
}

function renderCountryList(data) {
  // кешируем для выбора из списка без запроса к серверу
  renderCountryList.data = data;
  refs.countryList.innerHTML = markup.getCountryList(data); // getListMarkup(data);
}

function renderCountryDetails(data, newWindow = true) {
  const target = newWindow
    ? open('', '', 'width=500,height=250').document.body
    : refs.countryInfo;

  target.innerHTML = markup.getCountryDetails(data);
}

////////////////////////
// Доп. функционал
////////////////////////

// очистка поля ввода
refs.clearInputBtn.addEventListener('click', () => {
  refs.searchInput.value = '';
  clearAllCountryInfo();
});

// выбор из списка стран для показа детальной информации
refs.countryList.addEventListener('click', ({ target }) => {
  if (target.tagName !== 'SPAN') return;

  const selected = renderCountryList.data[target.dataset.idx];

  refs.searchInput.value = selected.name.official;
  renderCountryDetails([selected]);
});
