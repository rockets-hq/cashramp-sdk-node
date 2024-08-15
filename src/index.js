/**
 * A response from the Cashramp API
 * @typedef {Object} CashrampResponse
 * @property {boolean} success True/false if the API request succeeds/fails
 * @property {object} result The result of the API request
 * @property {string} error The error message if the API request failed (ie. `success` = false)
 */


const fetch = require('node-fetch');
const { AVAILABLE_COUNTRIES, MARKET_RATE, PAYMENT_METHOD_TYPES, RAMPABLE_ASSETS, RAMP_LIMITS, PAYMENT_REQUEST, ACCOUNT } = require('./queries');
const { CONFIRM_TRANSACTION, INITIATE_HOSTED_PAYMENT, CANCEL_HOSTED_PAYMENT, CREATE_CUSTOMER, ADD_PAYMENT_METHOD, WITHDRAW_ONCHAIN } = require('./mutations');

class Cashramp {
  /**
   * Cashramp API client
   * @constructor
   * @param {object} options Initialization options
   * @param {"test"|"live"} options.env Preferred Cashramp environment
   * @param {string} options.secretKey Your secret key
   */
  constructor({ env, secretKey, }) {
    this._env = env || process.env.CASHRAMP_ENV || "live";
    if (!["test", "live"].includes(this._env)) throw new Error(`"${this._env}" is not a valid env. Can either be "test" or "live".`)

    this._secretKey = secretKey || process.env.CASHRAMP_SECRET_KEY;
    if (!this._secretKey) throw new Error("Please provide your API secret key.")

    this._setup();
  }

  // QUERIES
  /**
   * Fetch the countries that Cashramp is available in
   * @returns {CashrampResponse} response.result { id: string, name: string, code: string }
   */
  async getAvailableCountries() {
    return this.sendRequest({ name: "availableCountries", query: AVAILABLE_COUNTRIES })
  }

  /**
  * Fetch the Cashramp market rate for a country
  * @param {object} options
  * @param {string} options.countryCode The two-letter ISO 3166-1 country code
  * @returns {CashrampResponse} response.result { depositRate: string, withdrawalRate: string }
  */
  async getMarketRate({ countryCode }) {
    return this.sendRequest({ name: "marketRate", query: MARKET_RATE, variables: { countryCode } })
  }

  /**
   * Fetch the payment method types available in a country
   * @param {object} options
   * @param {string} options.country The country's global ID
   * @returns {CashrampResponse} response.result [{ id: string, identifier: string, fields: [{ label: string, identifier: string, required: boolean }]}]
   */
  async getPaymentMethodTypes({ country }) {
    return this.sendRequest({ name: "p2pPaymentMethodTypes", query: PAYMENT_METHOD_TYPES, variables: { country } })
  }

  /**
   * Fetch the assets you can on/offramp with the Onchain Ramp
   * @returns {CashrampResponse} response.result [{ name: string, symbol: string, networks: [string], contractAddress: object }]
   */
  async getRampableAssets() {
    return this.sendRequest({ name: "rampableAssets", query: RAMPABLE_ASSETS });
  }

  /**
   * Fetch the Onchain Ramp limits
   * @returns {CashrampResponse} response.result { minimumDepositUsd: string, maximumDepositUsd: string, minimumWithdrawalUsd: string, maximumWithdrawalUsd: string, dailyLimitUsd: string }
   */
  async getRampLimits() {
    return this.sendRequest({ name: "rampLimits", query: RAMP_LIMITS })
  }

  /**
   * Fetch the details of a payment request
   * @param {object} options
   * @param {string} reference The payment request's reference
   * @returns {CashrampResponse}
   */
  async getPaymentRequest({ reference }) {
    return this.sendRequest({ name: "merchantPaymentRequest", query: PAYMENT_REQUEST, variables: { reference } })
  }

  /**
   * Fetch your account's balance & deposit address
   * @returns {CashrampResponse} response.result { accountBalance: string, depositAddress: string }
   */
  async getAccount() {
    return this.sendRequest({ name: "account", query: ACCOUNT });
  }

  // MUTATIONS

  /**
   * Confirm a crypto transfer sent into Cashramp's Secure Escrow address
   * @param {object} options
   * @param {string} options.paymentRequest The payment request's global ID
   * @param {string} options.transactionHash The transaction hash of the crypto transfer sent to Cashramp's Secure Escrow address
   * @returns {CashrampResponse}
   */
  async confirmTransaction({ paymentRequest, transactionHash }) {
    return this.sendRequest({ name: "confirmTransaction", query: CONFIRM_TRANSACTION, variables: { paymentRequest, transactionHash } })
  }

  /**
   * Initiate a payment request
   * @param {object} options
   * @param {number} options.amount The amount you want to deposit or withdraw
   * @param {"local_currency"|"usd"} options.currency The currency for the payment request
   * @param {string} options.countryCode The two-letter ISO 3166-1 country code
   * @param {"deposit"|"withdrawal"} options.paymentType The type of payment request
   * @param {string} options.reference An optional reference for the payment request
   * @param {string} options.redirectUrl An optional URL to redirect to after the payment request is completed
   * @param {string} options.firstName The customer's first name
   * @param {string} options.lastName The customer's last name
   * @param {string} options.email The customer's email address
   * @returns {CashrampResponse} response.result { id: string, hostedLink: string, status: string }
   */
  async initiateHostedPayment({ amount, currency, countryCode, paymentType, reference, redirectUrl, firstName, lastName, email }) {
    return this.sendRequest({
      name: "initiateHostedPayment", query: INITIATE_HOSTED_PAYMENT, variables: {
        amount, currency, countryCode, email, paymentType, reference, firstName, lastName, redirectUrl
      }
    });
  }

  /**
   * Cancel an initiated payment request
   * @param {object} options
   * @param {string} options.paymentRequest The payment request's global ID
   * @returns {CashrampResponse}
   */
  async cancelHostedPayment({ paymentRequest }) {
    return this.sendRequest({
      name: "cancelHostedPayment", query: CANCEL_HOSTED_PAYMENT, variables: {
        paymentRequest
      }
    });
  }

  /**
   * Create a customer
   * @param {object} options
   * @param {string} options.firstName The customer's first name
   * @param {string} options.lastName The customer's last name
   * @param {string} options.email The customer's email address
   * @returns {CashrampResponse}
   */
  async createCustomer({ firstName, lastName, email, country }) {
    return this.sendRequest({
      name: "createCustomer", query: CREATE_CUSTOMER, variables: { firstName, lastName, email, country }
    });
  }

  /**
   * PaymentMethodField
   * @typedef PaymentMethodField
   * @property {string} identifier
   * @property {string} value
   */

  /**
   * Add a payment method for an existing customer
   * @param {object} options
   * @param {string} options.customer The customer's global ID
   * @param {string} options.p2pPaymentMethodType The payment method type's global ID
   * @param {[PaymentMethodField]} options.fields The fields of the payment method
   * @returns {CashrampResponse}
   */
  async addPaymentMethod({ customer, paymentMethodType, fields }) {
    return this.sendRequest({
      name: "addPaymentMethod", query: ADD_PAYMENT_METHOD, variables: { customer, paymentMethodType, fields }
    });
  }

  /**
   * Withdraw from your balance to an onchain wallet address
   * @param {object} options
   * @param {string} options.address The wallet address to withdraw to
   * @param {string} options.amountUsd The amount to withdraw to the address provided
   * @returns {CashrampResponse}
   */
  async withdrawOnchain({ address, amountUsd }) {
    return this.sendRequest({ name: "withdrawOnchain", query: WITHDRAW_ONCHAIN, variables: { address, amountUsd } });
  }

  // GENERAL
  /**
   * Query the Cashramp API directly
   * @param {object} options
   * @param {string} options.name The name of the query/mutation
   * @param {string} options.query The GraphQL query string
   * @param {object} options.variables (Optional) Pass in variables for the GraphQL query
   * @returns {CashrampResponse}
   */
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
