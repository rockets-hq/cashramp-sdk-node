const fetch = require('node-fetch');
const { AVAILABLE_COUNTRIES, MARKET_RATE, PAYMENT_METHOD_TYPES, RAMPABLE_ASSETS, RAMP_LIMITS, PAYMENT_REQUEST, ACCOUNT } = require('./queries');

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

  // PRIVATE METHODS

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
      console.log(json);
    } catch (err) {
      console.log(err);
      return { success: false, error: err.message || "Something went wrong." }
    }
  }

  _setup() {
    let host = "api.useaccrue.com";
    if (this._env == "test") host = `staging.${host}`;
    this._apiURL = `https://${host}/cashramp/api/graphql`;
  }
}

module.exports = Cashramp;
