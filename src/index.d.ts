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

  /** Represents a Ramp Quote for a Direct Ramp payment */
  export interface RampQuote {
    id: string;
    exchangeRate: string;
    paymentType: PaymentType;
  }

  /** Options for requesting a Ramp Quote */
  export interface RampQuoteOptions {
    customer: string;
    amount: number;
    currency: PaymentCurrency;
    paymentType: PaymentType;
    paymentMethodType: string;
    /** Optional ISO 3166-2 country code (e.g 'GH', 'NG') */
    country?: string;
  }

  /** Options for refreshing a Ramp Quote */
  export interface RefreshRampQuoteOptions {
    rampQuote: string;
    amount?: number;
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

  export enum PaymentType {
    DEPOSIT = 'deposit',
    WITHDRAWAL = 'withdrawal'
  }

  /** Represents the details of a payment request */
  export interface PaymentRequestDetails {
    id: string,
    status: string,
    paymentType: PaymentType,
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
    paymentType: PaymentType;
    /** An optional reference for the payment request */
    reference?: string;
    /** An optional metadata object for the payment request echoed in webhooks */
    metadata?: Record<string, any>;
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

  /** Represents a Ramp Quote for a Direct Ramp payment */
  export interface DirectRamp {
    id: string;
    status: string;
    agent: string;
    paymentDetails: string;
    exchangeRate: number;
    amountLocal: number;
    amountUsd: number;
    expiresAt: string;
  }

  /** Options for initiating a Ramp Quote deposit */
  export interface InitiateRampQuoteDepositOptions {
    rampQuote: string;
    reference?: string;
    /** Customer's phone number if paying via MoMo */
    phoneNumber?: string;
    /** Customer's bank account number if paying via bank */
    bankAccountNumber?: string;
  }

  /** Options for initiating a Ramp Quote withdrawal */
  export interface InitiateRampQuoteWithdrawalOptions {
    rampQuote: string;
    paymentMethod: string;
    reference?: string;
  }

  /** Options for marking a deposit payment request as paid */
  export interface MarkDepositAsPaidOptions {
    paymentRequest: string;
    receipt: string;
  }

  /** Options for marking a withdrawal payment request as received */
  export interface MarkWithdrawalAsReceivedOptions {
    paymentRequest: string;
  }

  /** Options for canceling a deposit payment request */
  export interface CancelDepositOptions {
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
    /** The payment method type's identifier */
    paymentMethodType: string;
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
    /** (Optional) Which Cashramp schema to target. Defaults to "merchant". */
    endpoint?: 'merchant' | 'bot';
  }

  /** Pagination metadata returned by paginated bot agent endpoints */
  export interface BotAgentPagination {
    page: number;
    perPage: number;
    total: number;
  }

  /** A bot agent profile (operationally useful subset of CashrampAgentProfile) */
  export interface BotAgentProfile {
    id: string;
    email: string;
    accountBalance: string;
    escrowBalance: string;
    bonusEarnings: string;
    depositAddress: string;
    verificationStatus: string;
    autoUpdateDepositRate: boolean;
    autoUpdateWithdrawalRate: boolean;
    creditLine: string;
    usedCreditLine: string;
    depositMargin: string;
    withdrawalMargin: string;
    averageDepositRate: string;
    averageWithdrawalRate: string;
    depositsCompleted: number;
    withdrawalsCompleted: number;
    totalDepositFiatAmount: string;
    totalDepositUsdAmount: string;
    totalWithdrawalFiatAmount: string;
    totalWithdrawalUsdAmount: string;
    enforceReceiptUpload: boolean;
    apiKey: string;
  }

  /** A P2P payment row from the bot agent order history */
  export interface BotAgentP2PPayment {
    id: string;
    status: string;
    paymentType: PaymentType;
    exchangeRate: string;
    exchangeRateMinusSurcharge: string;
    orderId: string;
    source: string;
    instant: boolean;
    createdAt: string;
    expiresAt: string;
    expiresAtSecs: number;
    reassigning: boolean;
    reassignAfter: string;
    reassignAfterSecs: number;
    agentCutOfFees: string;
    fxSpreadRevenue: string;
  }

  /** Order history filter passed to getBotAgentOrderHistory */
  export interface BotAgentOrderHistoryFilter {
    orderId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    paymentMethod?: string;
  }

  /** Options for getBotAgentOrderHistory */
  export interface GetBotAgentOrderHistoryOptions {
    page: number;
    perPage?: number;
    filter?: BotAgentOrderHistoryFilter;
  }

  /** Paginated bot agent order history result */
  export interface BotAgentOrderHistory {
    data: BotAgentP2PPayment[];
    pagination: BotAgentPagination;
  }

  /** Options for getBotAgentWithdrawalInfo */
  export interface GetBotAgentWithdrawalInfoOptions {
    /** The crypto symbol (e.g. "USDC") */
    symbol: string;
  }

  /** Withdrawal info returned for a crypto symbol */
  export interface BotAgentWithdrawalInfo {
    symbol: string;
    networks: string[];
    addressRegex?: string;
    memoRegex?: string;
  }

  /** Options for accept/cancel bot agent withdrawal and mark deposit received */
  export interface BotAgentP2PPaymentOptions {
    /** The P2P payment's global ID */
    paymentRequest: string;
  }

  /** Options for markBotAgentWithdrawalPaid */
  export interface MarkBotAgentWithdrawalPaidOptions {
    /** The P2P payment's global ID */
    paymentRequest: string;
    /** The payment method's global ID the agent paid from */
    paymentMethod: string;
    /** Optional receipt string */
    receipt?: string;
  }

  /** Options for updateBotAgentRates. All fields optional; only provided keys are sent. */
  export interface UpdateBotAgentRatesOptions {
    depositRate?: number | string;
    depositMargin?: number | string;
    withdrawalRate?: number | string;
    withdrawalMargin?: number | string;
  }

  /** Options for updateBotAgentPaymentMethodLiquidity */
  export interface UpdateBotAgentPaymentMethodLiquidityOptions {
    /** Required local-currency amount */
    amountLocal: number | string;
    /** Optional existing payment method global ID */
    paymentMethod?: string;
    /** Optional payment method type identifier */
    paymentMethodType?: string;
  }

  /** A P2P payment method as returned by the bot agent liquidity mutation */
  export interface BotAgentP2PPaymentMethod {
    id: string;
    value: string;
    displayValue: string;
    localCurrencyAvailable: string;
    deleted: boolean;
    ownership: string;
    designation: string;
    instant: boolean;
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
     * Request a new Ramp Quote for a Direct Ramp payment
     * @param options Options for requesting a Ramp Quote
     * @returns Promise resolving to CashrampResponse with RampQuote
     */
    getRampQuote(options: RampQuoteOptions): Promise<CashrampResponse<RampQuote>>;

    /**
     * Refresh a Ramp Quote for a Direct Ramp payment
     * @param options Options for refreshing a Ramp Quote
     * @returns Promise resolving to CashrampResponse with RampQuote
     */
    refreshRampQuote(options: RefreshRampQuoteOptions): Promise<CashrampResponse<RampQuote>>;

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
     * Initiate a Ramp Quote deposit
     * @param options Options for initiating a Ramp Quote deposit
     * @returns Promise resolving to CashrampResponse with DirectRamp
     */
    initiateRampQuoteDeposit(options: InitiateRampQuoteDepositOptions): Promise<CashrampResponse<DirectRamp>>;

    /**
     * Initiate a Ramp Quote withdrawal
     * @param options Options for initiating a Ramp Quote withdrawal
     * @returns Promise resolving to CashrampResponse with DirectRamp
     */
    initiateRampQuoteWithdrawal(options: InitiateRampQuoteWithdrawalOptions): Promise<CashrampResponse<DirectRamp>>;

    /**
     * Mark a withdrawal payment request as received
     * @param options Options for marking a withdrawal payment request as received
     * @returns Promise resolving to CashrampResponse
     */
    markWithdrawalAsReceived(options: MarkWithdrawalAsReceivedOptions): Promise<CashrampResponse>;

    /**
     * Mark a deposit payment request as paid
     * @param options Options for marking a deposit payment request as paid
     * @returns Promise resolving to CashrampResponse
     */
    markDepositAsPaid(options: MarkDepositAsPaidOptions): Promise<CashrampResponse>;

    /**
     * Cancel a deposit payment request
     * @param options Options for canceling a deposit payment request
     * @returns Promise resolving to CashrampResponse
     */
    cancelDeposit(options: CancelDepositOptions): Promise<CashrampResponse>;

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
     * Fetch the authenticated bot agent's profile
     * @returns Promise resolving to CashrampResponse with BotAgentProfile
     */
    getBotAgentProfile(): Promise<CashrampResponse<BotAgentProfile>>;

    /**
     * Fetch the bot agent's order history (page/perPage pagination)
     * @param options Page, perPage, and optional filter
     * @returns Promise resolving to CashrampResponse with BotAgentOrderHistory
     */
    getBotAgentOrderHistory(options: GetBotAgentOrderHistoryOptions): Promise<CashrampResponse<BotAgentOrderHistory>>;

    /**
     * Fetch withdrawal info for a crypto symbol (used by bot agents before paying out onchain)
     * @param options Crypto symbol
     * @returns Promise resolving to CashrampResponse with BotAgentWithdrawalInfo
     */
    getBotAgentWithdrawalInfo(options: GetBotAgentWithdrawalInfoOptions): Promise<CashrampResponse<BotAgentWithdrawalInfo>>;

    /**
     * Accept an assigned withdrawal request as a bot agent
     * @param options P2P payment global ID
     */
    acceptBotAgentWithdrawal(options: BotAgentP2PPaymentOptions): Promise<CashrampResponse<boolean>>;

    /**
     * Cancel/decline an assigned withdrawal request as a bot agent
     * @param options P2P payment global ID
     */
    cancelBotAgentWithdrawal(options: BotAgentP2PPaymentOptions): Promise<CashrampResponse<boolean>>;

    /**
     * Acknowledge receipt of customer fiat for a deposit leg as a bot agent
     * @param options P2P payment global ID
     */
    markBotAgentDepositReceived(options: BotAgentP2PPaymentOptions): Promise<CashrampResponse<boolean>>;

    /**
     * Acknowledge sending fiat for a withdrawal leg as a bot agent
     * @param options P2P payment global ID, paying payment method, and optional receipt
     */
    markBotAgentWithdrawalPaid(options: MarkBotAgentWithdrawalPaidOptions): Promise<CashrampResponse<boolean>>;

    /**
     * Update bot agent rates and margins (only provided fields are sent)
     * @param options Optional rate/margin fields
     */
    updateBotAgentRates(options?: UpdateBotAgentRatesOptions): Promise<CashrampResponse<boolean>>;

    /**
     * Set the local-currency liquidity available for a bot agent payment method
     * @param options Local currency amount and identifier (paymentMethod or paymentMethodType)
     */
    updateBotAgentPaymentMethodLiquidity(options: UpdateBotAgentPaymentMethodLiquidityOptions): Promise<CashrampResponse<BotAgentP2PPaymentMethod>>;

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
