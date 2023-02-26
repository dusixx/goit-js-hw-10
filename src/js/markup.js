function getCountryList(data = []) {
  return data
    .map(
      ({ name, flags }, idx) =>
        `<li class="country-list__item">
            <img class="country-list__flag" src=${flags.svg} width="20" alt="state flag">
            <span class="country-list__name" data-idx="${idx}">${name.official}</span>
        </li>`
    )
    .join('');
}

function getCountryDetails(data = []) {
  const [{ name, flags, capital, population, languages }] = data;

  return `
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

export default {
  getCountryDetails,
  getCountryList,
};
