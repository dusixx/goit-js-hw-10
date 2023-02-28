const DEF_REQUIRED_FIELDS = 'name,capital,population,flags,languages';
const server = {
  url: 'https://restcountries.com',
  apiVer: 'v3.1',
};

const fetchCountriesByName = (name, fields = DEF_REQUIRED_FIELDS) => {
  const byName = `${server.url}/${server.apiVer}/name/${name}${
    fields ? `?fields=${fields}` : ''
  }`;

  return fetch(byName).then(resp =>
    resp.ok ? resp.json() : Promise.reject(resp)
  );
};

export default {
  fetchCountriesByName,
};
