const { AVAILABLE_COUNTRIES } = require('../queries');

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

  // QUERIES
  async availableCountries() {

  }
}
