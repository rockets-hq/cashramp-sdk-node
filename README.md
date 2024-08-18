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
// CommonJS
const Cashramp = require("cashramp");

// ES6 import
import Cashramp from "cashramp";

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

- `getAvailableCountries()`: Fetch the countries that Cashramp is available in
- `getMarketRate({ countryCode })`: Fetch the Cashramp market rate for a country
- `getPaymentMethodTypes({ country })`: Fetch the payment method types available in a country
- `getRampableAssets()`: Fetch the assets you can on/offramp with the Onchain Ramp
- `getRampLimits()`: Fetch the Onchain Ramp limits
- `getPaymentRequest({ reference })`: Fetch the details of a payment request
- `getAccount()`: Fetch the account information for the authenticated user.

### Mutations

- `confirmTransaction({ paymentRequest, transactionHash })`: Confirm a crypto transfer sent into Cashramp's Secure Escrow address
- `initiateHostedPayment({ amount, paymentType, countryCode, currency, email, reference, redirectUrl, firstName, lastName })`: Initiate a payment request
- `cancelHostedPayment({ paymentRequest })`: Cancel an ongoing payment request
- `createCustomer({ firstName, lastName, email, country })`: Create a new customer profile
- `addPaymentMethod({ customer, paymentMethodType, fields })`: Add a payment method for an existing customer
- `withdrawOnchain({ address, amountUsd })`:  Withdraw from your balance to an onchain wallet address

## Custom Queries

For advanced use cases where the provided methods don't cover your specific needs, you can use the `sendRequest` method to send custom GraphQL queries:

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

## Error Handling

All methods in the SDK return a response object with a `success` boolean. When `success` is `false`, an `error` property will be available with details about the error. Always check the `success` property before accessing the `result`.

## TypeScript Support

This SDK includes TypeScript definitions out of the box. No additional types package is needed.

## Documentation

For detailed API documentation, visit [Cashramp's API docs](https://docs.cashramp.co).
