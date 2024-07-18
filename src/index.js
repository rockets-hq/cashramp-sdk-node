const fetch = require('node-fetch');
const { AVAILABLE_COUNTRIES, MARKET_RATE } = require('./queries');

class Cashramp {
  constructor({ env, publicKey, secretKey }) {
    this._env = env || process.env.CASHRAMP_ENV || "live";
    this._publicKey = publicKey || process.env.CASHRAMP_PUBLIC_KEY;
    this._secretKey = secretKey || process.env.CASHRAMP_SECRET_KEY;

    this._setup();
  }

  // QUERIES
  async getAvailableCountries() {
    return this._performRequest({ name: "availableCountries", query: AVAILABLE_COUNTRIES })
  }

  async getMarketRate({ countryCode }) {
    return this._performRequest({ name: "marketRate", query: MARKET_RATE, variables: { countryCode } })
  }

  // PRIVATE METHODS

  _setup() {
    let host = "api.useaccrue.com";
    if (this._env == "test") host = `staging.${host}`;
    this._apiURL = `https://${host}/cashramp/api/graphql`;
  }

  async _performRequest({ name, query, variables }) {
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
}

module.exports = Cashramp;
