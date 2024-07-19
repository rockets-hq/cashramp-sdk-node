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

const RAMPABLE_ASSETS = `
  query {
    rampableAssets {
      name
      symbol
      networks
      contractAddress
    }
  }
`;

const RAMP_LIMITS = `
  query {
    rampLimits {
      minimumDepositUsd
      maximumDepositUsd
      minimumWithdrawalUsd
      maximumWithdrawalUsd
      dailyLimitUsd
    }
  }
`;

const PAYMENT_REQUEST = `
  query ($reference: String!) {
    merchantPaymentRequest(reference: $reference) {
      id
      paymentType
      hostedLink
      amount
      currency
      reference
      status
    }
  }
`;

const ACCOUNT = `
  query {
    account {
      id
      accountBalance
      depositAddress
    }
  }
`;


module.exports = {
  AVAILABLE_COUNTRIES,
  MARKET_RATE,
  PAYMENT_METHOD_TYPES,
  RAMPABLE_ASSETS,
  RAMP_LIMITS,
  PAYMENT_REQUEST,
  ACCOUNT
}
