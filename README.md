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

# Yarn
yarn add cashramp
```

### 👨🏾‍💻 Setup

```js
const Cashramp = require("cashramp");

const cashrampAPI = new Cashramp({
  env: "test", // Can be either `test` or `live`
  secretKey: "CSHRMP-SECK_apE0rjq1tiWl6VLB",
});
```

### 📨 Querying the API

The Cashramp SDK has methods for frequently used queries and mutations. Additionally, you can construct your own query/mutation and query the API directly.

_Here's a simple query to fetch the countries Cashramp is available in. Alternatively, you can use `Cashramp#getAvailableCountries()`._

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

## Queries

#### Available countries

```js
// Fetch the countries that Cashramp is available in
const response = await cashrampAPI.getAvailableCountries();
```

#### Market rate

```js
// Fetch the Cashramp market rate for a country
const response = await cashrampAPI.getMarketRate({ countryCode: "GH" });
```

#### Payment method types

```js
// Fetch the payment method types available in a country
const response = await cashrampAPI.getPaymentMethodTypes({
  country:
    "VHlwZXM6OkNvdW50cnktZWMyOTY3N2QtMGYyYS00NjYzLWIzNDgtNGE5MDIxZWFmNGY3",
});
```

#### Rampable assets

```js
// Fetch the assets you can on/offramp with the Onchain Ramp
const response = await cashrampAPI.getRampableAssets();
```

#### Ramp limits

```js
// Fetch the Onchain Ramp limits
const response = await cashrampAPI.getRampLimits();
```

#### Payment request

```js
// Fetch the details of a payment request
const response = await cashrampAPI.getPaymentRequest({
  reference: "test_ref_1",
});
```

#### Account

```js
// Fetch your account's balance & deposit address
const response = await cashrampAPI.getAccount();
```

## Mutations

#### Confirm transaction

```js
// Confirm a crypto transfer sent into Cashramp's Secure Escrow address
const response = await cashrampAPI.confirmTransaction({
  paymentRequest:
    "VHlwZXM6OkNhc2hyYW1wOjpBUEk6Ok1lcmNoYW50UGF5bWVudFJlcXVlc3QtYTgwMWQ1NjAtOTYyYi00MjJkLWEyYzItZjY2NzZhZGE4NDY5",
  transactionHash:
    "0x9378c8f2940105debec0c436127f577440b611cf3b92d2967cca53c34c67612a",
});
```

#### Initiate hosted payment

```js
// Initiate a payment request
const response = await cashrampAPI.initiateHostedPayment({
  amount: 20,
  paymentType: "deposit",
  countryCode: "NG",
  currency: "usd",
  email: "test@example.com",
  reference: "test_ref_1",
  redirectUrl: "https://example.com/order/success?id=test_ref_1",
  firstName: "Jane",
  lastName: "Dore",
});
```

#### Cancel hosted payment

```js
// Cancel an initiated payment request
const response = await cashrampAPI.cancelHostedPayment({
  paymentRequest:
    "VHlwZXM6OkNhc2hyYW1wOjpBUEk6Ok1lcmNoYW50UGF5bWVudFJlcXVlc3QtYTY3MWVhZjQtYmVmYy00ZTEwLWI4YTQtZjk5MDZlNzZhNGUw",
});
```

#### Create a customer

```js
// Create a customer
const response = await cashrampAPI.createCustomer({
  firstName: "Jane",
  lastName: "Doe",
  email: "test@example.com",
  country:
    "VHlwZXM6OkNvdW50cnktOWY5MWE5NGYtNDUxYi00YWEyLWI2NjgtNjQ3YTM2ZDFjZmZh",
});
```

#### Add payment method

```js
// Add a payment method for an existing customer
const response = await cashrampAPI.addPaymentMethod({
  customer:
    "VHlwZXM6OkNhc2hyYW1wOjpBUEk6Ok1lcmNoYW50Q3VzdG9tZXItYTI5OGVmY2UtMGZjMy00YjBlLTgyNzAtYmM3Nzg5MzVjMjI0",
  paymentMethodType:
    "VHlwZXM6OkNhc2hyYW1wOjpQMlBQYXltZW50TWV0aG9kVHlwZS04MjZiYzhkNC04NTFlLTRhNGMtYjY3Zi04OGEwOThiZWMyNjE=",
  fields: [
    { identifier: "name", value: "Jane Doe" },
    { identifier: "phone_number", value: "0554078900" },
  ],
});
```

#### Withdraw onchain

```js
// Withdraw from your balance to an onchain wallet address
const response = await cashrampAPI.withdrawOnchain({
  address: "TQuFSvpct2FeBrKjRh8NDqtGAci2Z15RSe",
  amountUsd: 20,
});
```
