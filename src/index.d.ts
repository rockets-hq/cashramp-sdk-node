declare module 'cashramp' {

  /**
   * A response from the Cashramp API
   */
  export interface CashrampResponse<T = any> {
    /** True/false if the API request succeeds/fails */
    success: boolean;
    /** The result of the API request */
    result?: T;
    /** The error message if the API request failed (ie. `success` = false) */
    error?: string;
  }

  /**
   * Initialization options for the Cashramp client
   */
  export interface CashrampOptions {
    /** Preferred Cashramp environment */
    env?: 'test' | 'live';
    /** Your secret key */
    secretKey?: string;
  }

  /** Represents a country where Cashramp is available */
  export interface AvailableCountry {
    id: string;
    name: string;
    code: string;
  }

  /** Represents the market rate for a country */
  export interface MarketRate {
    depositRate: string;
    withdrawalRate: string;
  }

  /** Represents a field for a payment method type */
  export interface PaymentMethodField {
    label: string;
    identifier: string;
    required: boolean;
  }

  /** Represents a payment method type available in a country */
  export interface PaymentMethodType {
    id: string;
    identifier: string;
    fields: PaymentMethodField[];
  }

  /** Represents an asset that can be ramped on/off */
  export interface RampableAsset {
    name: string;
    symbol: string;
    networks: string[];
    contractAddress?: Record<string, string>;
  }

  /** Represents the Onchain Ramp limits */
  export interface RampLimits {
    minimumDepositUsd: string;
    maximumDepositUsd: string;
    minimumWithdrawalUsd: string;
    maximumWithdrawalUsd: string;
    dailyLimitUsd: string;
  }

  export enum PaymentCurrency {
    LOCAL_CURRENCY = 'local_currency',
    USD = 'usd'
  }

  /** Represents the details of a payment request */
  export interface PaymentRequestDetails {
    id: string,
    status: string,
    paymentType: string,
    currency: PaymentCurrency,
    amount: number,
    redirectUrl: string,
    reference: string,
    onchainAddress: string,
    onchainCryptocurrency: string,
    onchainNetwork: string,
    onchainFee: number,
    onchainTxHash: string,
    rampProcessingFee: number,
    hostedLink: string
  }

  /** Represents the account information for the authenticated user */
  export interface AccountInfo {
    accountBalance: string;
    depositAddress: string;
  }

  /** Options for fetching the market rate */
  export interface GetMarketRateOptions {
    /** The two-letter ISO 3166-1 country code */
    countryCode: string;
  }

  /** Options for fetching payment method types */
  export interface GetPaymentMethodTypesOptions {
    /** The country's global ID */
    country: string;
  }

  /** Options for fetching payment request details */
  export interface GetPaymentRequestOptions {
    /** The payment request's reference */
    reference: string;
  }

  /** Options for confirming a transaction */
  export interface ConfirmTransactionOptions {
    /** The payment request's global ID */
    paymentRequest: string;
    /** The transaction hash of the crypto transfer */
    transactionHash: string;
  }

  /** Options for initiating a hosted payment */
  export interface InitiateHostedPaymentOptions {
    /** The amount you want to deposit or withdraw */
    amount: number;
    /** The currency for the payment request (defaults to "usd") */
    currency?: 'local_currency' | 'usd';
    /** The two-letter ISO 3166-1 country code */
    countryCode: string;
    /** The type of payment request */
    paymentType: 'deposit' | 'withdrawal';
    /** An optional reference for the payment request */
    reference?: string;
    /** An optional URL to redirect to after completion */
    redirectUrl?: string;
    /** The customer's first name */
    firstName: string;
    /** The customer's last name */
    lastName: string;
    /** The customer's email address */
    email: string;
  }

  /** Options for canceling a hosted payment */
  export interface CancelHostedPaymentOptions {
    /** The payment request's global ID */
    paymentRequest: string;
  }

  /** Options for creating a customer */
  export interface CreateCustomerOptions {
    /** The customer's first name */
    firstName: string;
    /** The customer's last name */
    lastName: string;
    /** The customer's email address */
    email: string;
    /** The customer's country global ID */
    country: string;
  }

  /** Represents a field value for adding a payment method */
  export interface PaymentMethodFieldValue {
    identifier: string;
    value: string;
  }

  /** Options for adding a payment method */
  export interface AddPaymentMethodOptions {
    /** The customer's global ID */
    customer: string;
    /** The payment method type's global ID */
    p2pPaymentMethodType: string;
    /** The fields of the payment method */
    fields: PaymentMethodFieldValue[];
  }

  /** Options for withdrawing onchain */
  export interface WithdrawOnchainOptions {
    /** The wallet address to withdraw to */
    address: string;
    /** The amount in USD to withdraw */
    amountUsd: number;
  }

  /** Options for sending a raw GraphQL request */
  export interface SendRequestOptions {
    /** The name of the query/mutation */
    name: string;
    /** The GraphQL query string */
    query: string;
    /** (Optional) Variables for the GraphQL query */
    variables?: Record<string, any>;
  }

  export class Cashramp {
    /**
     * Cashramp API client
     * @param options Initialization options
     */
    constructor(options: CashrampOptions);

    /**
     * Fetch the countries that Cashramp is available in
     * @returns Promise resolving to CashrampResponse with an array of AvailableCountry
     */
    getAvailableCountries(): Promise<CashrampResponse<AvailableCountry[]>>;

    /**
     * Fetch the Cashramp market rate for a country
     * @param options Options containing the country code
     * @returns Promise resolving to CashrampResponse with MarketRate
     */
    getMarketRate(options: GetMarketRateOptions): Promise<CashrampResponse<MarketRate>>;

    /**
     * Fetch the payment method types available in a country
     * @param options Options containing the country ID
     * @returns Promise resolving to CashrampResponse with an array of PaymentMethodType
     */
    getPaymentMethodTypes(options: GetPaymentMethodTypesOptions): Promise<CashrampResponse<PaymentMethodType[]>>;

    /**
     * Fetch the assets you can on/offramp with the Onchain Ramp
     * @returns Promise resolving to CashrampResponse with an array of RampableAsset
     */
    getRampableAssets(): Promise<CashrampResponse<RampableAsset[]>>;

    /**
     * Fetch the Onchain Ramp limits
     * @returns Promise resolving to CashrampResponse with RampLimits
     */
    getRampLimits(): Promise<CashrampResponse<RampLimits>>;

    /**
     * Fetch the details of a payment request
     * @param options Options containing the payment request reference
     * @returns Promise resolving to CashrampResponse with PaymentRequestDetails
     */
    getPaymentRequest(options: GetPaymentRequestOptions): Promise<CashrampResponse<PaymentRequestDetails>>;

    /**
     * Fetch the account information for the authenticated user.
     * @returns Promise resolving to CashrampResponse with AccountInfo
     */
    getAccount(): Promise<CashrampResponse<AccountInfo>>;

    /**
     * Confirm a crypto transfer sent into Cashramp's Secure Escrow address
     * @param options Options containing payment request ID and transaction hash
     * @returns Promise resolving to CashrampResponse
     */
    confirmTransaction(options: ConfirmTransactionOptions): Promise<CashrampResponse>;

    /**
     * Initiate a payment request
     * @param options Options for initiating the payment
     * @returns Promise resolving to CashrampResponse with PaymentRequestDetails
     */
    initiateHostedPayment(options: InitiateHostedPaymentOptions): Promise<CashrampResponse<PaymentRequestDetails>>;

    /**
     * Cancel an ongoing payment request
     * @param options Options containing the payment request ID
     * @returns Promise resolving to CashrampResponse
     */
    cancelHostedPayment(options: CancelHostedPaymentOptions): Promise<CashrampResponse>;

    /**
     * Create a new customer profile
     * @param options Options for creating the customer
     * @returns Promise resolving to CashrampResponse (result type might need clarification from API)
     */
    createCustomer(options: CreateCustomerOptions): Promise<CashrampResponse>;

    /**
     * Add a payment method for an existing customer
     * @param options Options for adding the payment method
     * @returns Promise resolving to CashrampResponse (result type might need clarification from API)
     */
    addPaymentMethod(options: AddPaymentMethodOptions): Promise<CashrampResponse>;

    /**
     * Withdraw from your balance to an onchain wallet address
     * @param options Options for the withdrawal
     * @returns Promise resolving to CashrampResponse (result type might need clarification from API)
     */
    withdrawOnchain(options: WithdrawOnchainOptions): Promise<CashrampResponse>;

    /**
     * Query the Cashramp API directly
     * @param options Options containing the GraphQL query details
     * @returns Promise resolving to CashrampResponse
     */
    sendRequest<T = any>(options: SendRequestOptions): Promise<CashrampResponse<T>>;
  }

  // Export the class as the default export
  export default Cashramp;
} 