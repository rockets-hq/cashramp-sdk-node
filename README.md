<p align="center">
  <a href="https://github.com/rockets-hq/cashramp-sdk-node/"><img src="https://github.com/rockets-hq/cashramp-sdk-node/actions/workflows/test.yml/badge.svg" /></a>
  <img alt="Last Commit" src="https://badgen.net/github/last-commit/rockets-hq/cashramp-sdk-node" />
  <a href="https://www.npmjs.com/package/cashramp"><img src="https://img.shields.io/npm/v/cashramp.svg"/></a>
  <img alt="Bundle Size" src="https://badgen.net/bundlephobia/minzip/cashramp"/>
  <img alt="Downloads" src="https://img.shields.io/npm/dt/cashramp.svg"/>
  <a href="https://github.com/rockets-hq/cashramp-sdk-node/"><img src="https://img.shields.io/github/stars/rockets-hq/cashramp-sdk-node.svg"/></a>
  <a href="https://github.com/rockets-hq/cashramp-sdk-node/"><img src="https://img.shields.io/npm/l/cashramp.svg"/></a>
</p>

# Cashramp SDK

This is the official NodeJS SDK for [Cashramp's API](https://cashramp.co/commerce).

### ➕ Installation

```bash
# NPM
npm install cashramp --save

or

# Yarn
yarn add cashramp
```

### 👨🏾‍💻 Quick Start

```js
const Cashramp = require("cashramp");

const cashrampAPI = new Cashramp({
  env: "test", // Can be either `test` or `live`
  secretKey: "CSHRMP-SECK_apE0rjq1tiWl6VLB",
});

// Example: Fetch available countries
const response = await cashrampAPI.getAvailableCountries();
if (response.success) {
  console.log(response.result);
} else {
  console.log(response.error);
}
```

## API Reference

### Queries

- `getAvailableCountries()`
- `getMarketRate({ countryCode })`
- `getPaymentMethodTypes({ country })`
- `getRampableAssets()`
- `getRampLimits()`
- `getPaymentRequest({ reference })`
- `getAccount()`

### Mutations

- `confirmTransaction({ paymentRequest, transactionHash })`
- `initiateHostedPayment({ amount, paymentType, countryCode, currency, email, reference, redirectUrl, firstName, lastName })`
- `cancelHostedPayment({ paymentRequest })`
- `createCustomer({ firstName, lastName, email, country })`
- `addPaymentMethod({ customer, paymentMethodType, fields })`
- `withdrawOnchain({ address, amountUsd })`

## Custom Queries

For custom queries, use the `sendRequest` method:

```js
const query = `
  query {
    availableCountries {
      id
      name
      code
      currency {
        isoCode
        name
      }
    }
  }
`;

const response = await cashrampAPI.sendRequest({
  name: "availableCountries",
  query,
});

if (response.success) {
  console.log(response.result); // `result` contains the list of countries
}
```

## Documentation

For detailed API documentation, visit [Cashramp's API docs](https://docs.cashramp.co).
