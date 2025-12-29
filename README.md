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

The official NodeJS SDK for [Cashramp's API](https://cashramp.co/commerce).

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [Hosted Payments](#hosted-payments)
  - [Direct Ramp - Deposits](#direct-ramp---deposits)
  - [Direct Ramp - Withdrawals](#direct-ramp---withdrawals)
- [API Reference](#api-reference)
  - [Queries](#queries)
  - [Mutations](#mutations)
- [Custom Queries](#custom-queries)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)

## Installation

```bash
# NPM
npm install cashramp --save

# Yarn
yarn add cashramp
```

## Quick Start

```js
// CommonJS
const Cashramp = require("cashramp");

// ES6 import
import Cashramp from "cashramp";

const cashramp = new Cashramp({
  env: "test", // "test" for sandbox, "live" for production
  secretKey: "CSHRMP-SECK_your_secret_key",
});
```

## Usage Examples

### Hosted Payments

Hosted payments redirect users to Cashramp's hosted page to complete transactions.

```js
// Initiate a hosted deposit (user pays fiat, you receive crypto)
const deposit = await cashramp.initiateHostedPayment({
  amount: 100,
  currency: "usd", // "usd" or "local_currency"
  countryCode: "GH",
  paymentType: "deposit",
  reference: "order_123",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  redirectUrl: "https://yoursite.com/callback",
});

if (deposit.success) {
  // Redirect user to hosted page
  console.log(deposit.result.hostedLink);
}
```

### Direct Ramp - Deposits

Direct Ramp gives you full control over the payment UI. Users pay fiat and receive stablecoins.

```js
// Step 1: Create a customer
const customer = await cashramp.createCustomer({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  country: "country_global_id", // from getAvailableCountries()
});

// Step 2: Get a quote
const quote = await cashramp.getRampQuote({
  customer: customer.result.id,
  amount: 100,
  currency: "usd",
  paymentType: "deposit",
  paymentMethodType: "mobile_money", // from getPaymentMethodTypes()
});

// Step 3: Initiate the deposit
const deposit = await cashramp.initiateRampQuoteDeposit({
  rampQuote: quote.result.id,
  reference: "order_123",
  phoneNumber: "+233123456789", // for mobile money
});

if (deposit.success) {
  console.log(deposit.result.paymentDetails); // Show payment instructions to user
  console.log(deposit.result.expiresAt); // Payment deadline
}

// Step 4: Mark as paid (after user confirms payment)
await cashramp.markDepositAsPaid({
  paymentRequest: deposit.result.id,
  receipt: "optional_payment_receipt_url",
});
```

#### Receiving Stablecoins Onchain

To deliver stablecoins directly to a wallet address instead of your Cashramp Merchant Dashboard balance:

```js
const deposit = await cashramp.initiateRampQuoteDeposit({
  rampQuote: quote.result.id,
  reference: "order_123",
  onchainTransferInfo: {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    cryptocurrency: "usd_tether", // from getRampableAssets()
    network: "celo", // from getRampableAssets()
  },
});
```

### Direct Ramp - Withdrawals

Users receive fiat to their bank/mobile money from stablecoins.

```js
// Step 1: Create customer (if not exists)
const customer = await cashramp.createCustomer({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  country: "country_global_id",
});

// Step 2: Add a payment method for the customer
const paymentMethod = await cashramp.addPaymentMethod({
  customer: customer.result.id,
  paymentMethodType: "bank_transfer",
  fields: [
    { identifier: "account_number", value: "1234567890" },
    { identifier: "bank_name", value: "Example Bank" },
  ],
});

// Step 3: Get a quote
const quote = await cashramp.getRampQuote({
  customer: customer.result.id,
  amount: 50,
  currency: "usd",
  paymentType: "withdrawal",
  paymentMethodType: "bank_transfer",
});

// Step 4: Initiate withdrawal
const withdrawal = await cashramp.initiateRampQuoteWithdrawal({
  rampQuote: quote.result.id,
  paymentMethod: paymentMethod.result.id,
  reference: "withdrawal_456",
});

// Step 5: Mark as received (after user confirms receipt)
await cashramp.markWithdrawalAsReceived({
  paymentRequest: withdrawal.result.id,
});
```

## API Reference

### Queries

| Method                                     | Parameters                                             | Description                                        |
| ------------------------------------------ | ------------------------------------------------------ | -------------------------------------------------- |
| `getAvailableCountries()`                  | -                                                      | Fetch countries where Cashramp operates            |
| `getMarketRate({ countryCode })`           | `countryCode`: ISO 3166-1 code (e.g., "GH", "NG")      | Get current deposit/withdrawal rates               |
| `getPaymentMethodTypes({ country })`       | `country`: Country global ID                           | Get available payment methods (bank, mobile money) |
| `getRampableAssets()`                      | -                                                      | Get supported cryptocurrencies and networks        |
| `getRampLimits()`                          | -                                                      | Get min/max transaction limits                     |
| `getRampQuote({ ... })`                    | See below                                              | Request a quote for Direct Ramp                    |
| `refreshRampQuote({ rampQuote, amount? })` | `rampQuote`: Quote ID, `amount`: New amount (optional) | Refresh an existing quote                          |
| `getPaymentRequest({ reference })`         | `reference`: Your reference string                     | Fetch payment request details                      |
| `getAccount()`                             | -                                                      | Get your account balance and deposit address       |

#### getRampQuote Parameters

| Parameter           | Type   | Required | Description                   |
| ------------------- | ------ | -------- | ----------------------------- |
| `customer`          | string | Yes      | Customer's global ID          |
| `amount`            | number | Yes      | Amount to ramp                |
| `currency`          | string | Yes      | `"usd"` or `"local_currency"` |
| `paymentType`       | string | Yes      | `"deposit"` or `"withdrawal"` |
| `paymentMethodType` | string | Yes      | Payment method identifier     |
| `country`           | string | No       | ISO 3166-1 country code       |

### Mutations

#### Hosted Payments

| Method                                    | Description                    |
| ----------------------------------------- | ------------------------------ |
| `initiateHostedPayment({ ... })`          | Start a hosted payment session |
| `cancelHostedPayment({ paymentRequest })` | Cancel a hosted payment        |

#### Customer Management

| Method                                                      | Description                    |
| ----------------------------------------------------------- | ------------------------------ |
| `createCustomer({ firstName, lastName, email, country })`   | Create a new customer          |
| `addPaymentMethod({ customer, paymentMethodType, fields })` | Add payment method to customer |

#### Direct Ramp - Deposits

| Method                                                                                                        | Description                |
| ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `initiateRampQuoteDeposit({ rampQuote, reference?, phoneNumber?, bankAccountNumber?, onchainTransferInfo? })` | Start a deposit from quote |
| `markDepositAsPaid({ paymentRequest, receipt })`                                                              | Confirm user has paid      |
| `cancelDeposit({ paymentRequest })`                                                                           | Cancel a deposit           |

#### Direct Ramp - Withdrawals

| Method                                                                  | Description                   |
| ----------------------------------------------------------------------- | ----------------------------- |
| `initiateRampQuoteWithdrawal({ rampQuote, paymentMethod, reference? })` | Start a withdrawal from quote |
| `markWithdrawalAsReceived({ paymentRequest })`                          | Confirm user received funds   |

#### Other

| Method                                                    | Description                       |
| --------------------------------------------------------- | --------------------------------- |
| `confirmTransaction({ paymentRequest, transactionHash })` | Confirm crypto transfer to escrow |
| `withdrawOnchain({ address, amountUsd })`                 | Withdraw from balance to wallet   |

#### onchainTransferInfo Object

Used in `initiateRampQuoteDeposit` to deliver stablecoins onchain:

| Field            | Type   | Description                           |
| ---------------- | ------ | ------------------------------------- |
| `address`        | string | Destination wallet address            |
| `cryptocurrency` | string | e.g., `"usd_tether"`, `"usd_coin"`    |
| `network`        | string | e.g., `"celo"`, `"polygon"`, `"base"` |

## Custom Queries

For advanced use cases, use `sendRequest` to execute custom GraphQL queries:

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

const response = await cashramp.sendRequest({
  name: "availableCountries",
  query,
});

if (response.success) {
  console.log(response.result);
}
```

## Error Handling

All methods return a consistent response object:

```js
// Success response
{
  success: true,
  result: { /* response data */ }
}

// Error response
{
  success: false,
  error: "Error message describing what went wrong"
}
```

Always check `success` before accessing `result`:

```js
const response = await cashramp.getMarketRate({ countryCode: "GH" });

if (response.success) {
  console.log(`Deposit rate: ${response.result.depositRate}`);
  console.log(`Withdrawal rate: ${response.result.withdrawalRate}`);
} else {
  console.error(`Error: ${response.error}`);
}
```

## TypeScript Support

This SDK includes TypeScript definitions out of the box. No additional `@types` package needed.

## Documentation

For detailed API documentation and webhook integration, visit [Cashramp's API docs](https://docs.cashramp.co).
