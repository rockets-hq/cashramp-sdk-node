const { AVAILABLE_COUNTRIES } = require('./queries');
const fetch = require('node-fetch');

class Cashramp {
  constructor({ env, publicKey, secretKey }) {
    this._env = env || process.env.CASHRAMP_ENV || "live";
    this._publicKey = publicKey || process.env.CASHRAMP_PUBLIC_KEY;
    this._secretKey = secretKey || process.env.CASHRAMP_SECRET_KEY;

    this._setup();
  }

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
          query, variables
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._secretKey}`
        }
      });

      const json = await response.json();
      return { success: true, result: json.data[name] };
    } catch (err) {
      console.log(err);
      return { success: false, error: err.message || "Something went wrong." }
    }
  }

  // QUERIES
  async getAvailableCountries() {
    return this._performRequest({ name: "availableCountries", query: AVAILABLE_COUNTRIES })
  }
}

module.exports = Cashramp;
