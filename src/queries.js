const AVAILABLE_COUNTRIES = `
  query {
    availableCountries {
      id
      name
      code
    }
  }
`;

const MARKET_RATE = `
  query ($countryCode: String!) {
    marketRate(countryCode: $countryCode) {
      depositRate
      withdrawalRate
    }
  }
`;

module.exports = {
  AVAILABLE_COUNTRIES,
  MARKET_RATE
}
