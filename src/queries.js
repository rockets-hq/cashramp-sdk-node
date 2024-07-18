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

const PAYMENT_METHOD_TYPES = `
  query ($country: ID!) {
    p2pPaymentMethodTypes(country: $country) {
      id
      identifier
      label
      fields {
        label
        identifier
        required
      }
    }
  }
`;

module.exports = {
  AVAILABLE_COUNTRIES,
  MARKET_RATE,
  PAYMENT_METHOD_TYPES
}
