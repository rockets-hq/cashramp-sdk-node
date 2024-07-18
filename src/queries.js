const AVAILABLE_COUNTRIES = `
  query {
    availableCountries {
      id
      name
      code
    }
  }
`;

module.exports = {
  AVAILABLE_COUNTRIES
}
