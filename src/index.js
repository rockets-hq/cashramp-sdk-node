const fetch = require('node-fetch');
const { AVAILABLE_COUNTRIES, MARKET_RATE, PAYMENT_METHOD_TYPES, RAMPABLE_ASSETS, RAMP_LIMITS, PAYMENT_REQUEST, ACCOUNT } = require('./queries');
const { CONFIRM_TRANSACTION, INITIATE_HOSTED_PAYMENT, CANCEL_HOSTED_PAYMENT, CREATE_CUSTOMER, ADD_PAYMENT_METHOD, WITHDRAW_ONCHAIN } = require('./mutations');

class Cashramp {
  constructor({ env, publicKey, secretKey }) {
    this._env = env || process.env.CASHRAMP_ENV || "live";
    this._publicKey = publicKey || process.env.CASHRAMP_PUBLIC_KEY;
    this._secretKey = secretKey || process.env.CASHRAMP_SECRET_KEY;

    this._setup();
  }

  // QUERIES
  async getAvailableCountries() {
    return this.sendRequest({ name: "availableCountries", query: AVAILABLE_COUNTRIES })
  }

  async getMarketRate({ countryCode }) {
    return this.sendRequest({ name: "marketRate", query: MARKET_RATE, variables: { countryCode } })
  }

  async getPaymentMethodTypes({ country }) {
    return this.sendRequest({ name: "p2pPaymentMethodTypes", query: PAYMENT_METHOD_TYPES, variables: { country } })
  }

  async getRampableAssets() {
    return this.sendRequest({ name: "rampableAssets", query: RAMPABLE_ASSETS });
  }

  async getRampLimits() {
    return this.sendRequest({ name: "rampLimits", query: RAMP_LIMITS })
  }

  async getPaymentRequest({ reference }) {
    return this.sendRequest({ name: "merchantPaymentRequest", query: PAYMENT_REQUEST, variables: { reference } })
  }

  async getAccount() {
    return this.sendRequest({ name: "account", query: ACCOUNT });
  }

  // MUTATIONS

  async confirmTransaction({ paymentRequest, transactionHash }) {
    return this.sendRequest({ name: "confirmTransaction", query: CONFIRM_TRANSACTION, variables: { paymentRequest, transactionHash } })
  }

  async initiateHostedPayment({ amount, currency, countryCode, email, paymentType, reference, firstName, lastName, redirectUrl }) {
    return this.sendRequest({
      name: "initiateHostedPayment", query: INITIATE_HOSTED_PAYMENT, variables: {
        amount, currency, countryCode, email, paymentType, reference, firstName, lastName, redirectUrl
      }
    });
  }

  async cancelHostedPayment({ paymentRequest }) {
    return this.sendRequest({
      name: "cancelHostedPayment", query: CANCEL_HOSTED_PAYMENT, variables: {
        paymentRequest
      }
    });
  }

  async createCustomer({ firstName, lastName, email, country }) {
    return this.sendRequest({
      name: "createCustomer", query: CREATE_CUSTOMER, variables: { firstName, lastName, email, country }
    });
  }

  async addPaymentMethod({ customer, paymentMethodType, fields }) {
    return this.sendRequest({
      name: "addPaymentMethod", query: ADD_PAYMENT_METHOD, variables: { customer, paymentMethodType, fields }
    });
  }

  async withdrawOnchain({ address, amountUsd }) {
    return this.sendRequest({ name: "withdrawOnchain", query: WITHDRAW_ONCHAIN, variables: { address, amountUsd } });
  }

  // GENERAL
  async sendRequest({ name, query, variables }) {
    try {
      const response = await fetch(this._apiURL, {
        method: "post",
        body: JSON.stringify({
          query,
          variables
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._secretKey}`
        }
      });

      const json = await response.json();
      if (json.errors) {
        return { success: false, error: json.errors[0].message };
      } else {
        return { success: true, result: json.data[name] };
      }
    } catch (err) {
      console.log(err);
      return { success: false, error: err.message || "Something went wrong." }
    }
  }

  // PRIVATE METHODS

  _setup() {
    let host = "api.useaccrue.com";
    if (this._env == "test") host = `staging.${host}`;
    this._apiURL = `https://${host}/cashramp/api/graphql`;
  }
}

module.exports = Cashramp;
