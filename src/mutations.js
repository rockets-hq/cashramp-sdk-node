const CONFIRM_TRANSACTION = `
  mutation ($paymentRequest: ID!, $transactionHash: String!) {
    confirmTransaction(paymentRequest: $paymentRequest, transactionHash: $transactionHash)
  }
`;

const INITIATE_HOSTED_PAYMENT = `
  mutation ($amount: Decimal!, $currency: P2PPaymentCurrency, $countryCode: String!, $email: String!, $paymentType: P2PPaymentTypeType!, $reference: String!, $firstName: String!, $lastName: String!, $redirectUrl: String, $metadata: JSON) {
    initiateHostedPayment(amount: $amount, currency: $currency, countryCode: $countryCode, email: $email, paymentType: $paymentType, reference: $reference, firstName: $firstName, lastName: $lastName, redirectUrl: $redirectUrl, metadata: $metadata) {
      id
      hostedLink
      status
    }
  }
`;

const CANCEL_HOSTED_PAYMENT = `
  mutation ($paymentRequest: ID!) {
    cancelHostedPayment(paymentRequest: $paymentRequest)
  }
`;

const CREATE_CUSTOMER = `
  mutation ($email: String!, $firstName: String!, $lastName: String!, $country: ID!) {
    createCustomer(email: $email, firstName: $firstName, lastName: $lastName, country: $country) {
      id
      email
      firstName
      lastName
      country {
        id
        name
        code
      }
    }
  }
`;

const ADD_PAYMENT_METHOD = `
  mutation ($customer: ID!, $paymentMethodType: String!, $fields: [P2PPaymentMethodFieldInput!]!, $ownership: P2PPaymentMethodOwnership) {
    addPaymentMethod(customer: $customer, paymentMethodType: $paymentMethodType, fields: $fields, ownership: $ownership) {
      id
      value
      fields {
        identifier
        value
      }
    }
  }
`;

const WITHDRAW_ONCHAIN = `
  mutation ($address: String!, $amountUsd: Decimal!, $network: String, $metadata: JSON) {
    withdrawOnchain(address: $address, amountUsd: $amountUsd, network: $network, metadata: $metadata) {
      id
      status
    }
  }
`;

const INITIATE_RAMP_QUOTE_DEPOSIT = `
  mutation ($rampQuote: ID!, $reference: String, $phoneNumber: String, $bankAccountNumber: String, $onchainTransferInfo: OnchainTransferInfo) {
    initiateRampQuoteDeposit(rampQuote: $rampQuote, reference: $reference, phoneNumber: $phoneNumber, bankAccountNumber: $bankAccountNumber, onchainTransferInfo: $onchainTransferInfo) {
      id
      status
      agent
      paymentDetails
      exchangeRate
      amountLocal
      amountUsd
      expiresAt
    }
  }
`;

const INITIATE_RAMP_QUOTE_WITHDRAWAL = `
  mutation ($rampQuote: ID!, $paymentMethod: ID!, $reference: String) {
    initiateRampQuoteWithdrawal(rampQuote: $rampQuote, paymentMethod: $paymentMethod, reference: $reference) {
      id
      status
      agent
      paymentDetails
      exchangeRate
      amountLocal
      amountUsd
    }
  }
`;

const MARK_DEPOSIT_AS_PAID = `
  mutation ($paymentRequest: ID!, $receipt: String) {
    markDepositAsPaid(paymentRequest: $paymentRequest, receipt: $receipt)
  }
`;

const MARK_WITHDRAWAL_AS_RECEIVED = `
  mutation ($paymentRequest: ID!) {
    markWithdrawalAsReceived(paymentRequest: $paymentRequest)
  }
`;

const CANCEL_DEPOSIT = `
  mutation ($paymentRequest: ID!) {
    cancelDeposit(paymentRequest: $paymentRequest)
  }
`;

// ---------- Bot Agent ----------

const BOT_AGENT_ACCEPT_WITHDRAWAL = `
  mutation ($p2pPayment: ID!) {
    acceptWithdrawal(p2pPayment: $p2pPayment)
  }
`;

const BOT_AGENT_CANCEL_WITHDRAWAL = `
  mutation ($p2pPayment: ID!) {
    cancelWithdrawal(p2pPayment: $p2pPayment)
  }
`;

const BOT_AGENT_MARK_DEPOSIT_AS_RECEIVED = `
  mutation ($p2pPayment: ID!) {
    markDepositAsReceived(p2pPayment: $p2pPayment)
  }
`;

const BOT_AGENT_MARK_WITHDRAWAL_AS_PAID = `
  mutation ($p2pPayment: ID!, $paymentMethod: ID!, $receipt: String) {
    markWithdrawalAsPaid(p2pPayment: $p2pPayment, paymentMethod: $paymentMethod, receipt: $receipt)
  }
`;

const BOT_AGENT_UPDATE_RATES = `
  mutation ($depositRate: Decimal, $depositMargin: Decimal, $withdrawalRate: Decimal, $withdrawalMargin: Decimal) {
    updateRates(depositRate: $depositRate, depositMargin: $depositMargin, withdrawalRate: $withdrawalRate, withdrawalMargin: $withdrawalMargin)
  }
`;

const BOT_AGENT_UPDATE_PAYMENT_METHOD_LIQUIDITY = `
  mutation ($paymentMethod: ID, $paymentMethodType: String, $amountLocal: Decimal!) {
    updatePaymentMethodLiquidity(paymentMethod: $paymentMethod, paymentMethodType: $paymentMethodType, amountLocal: $amountLocal) {
      id
      value
      displayValue
      localCurrencyAvailable
      deleted
      ownership
      designation
      instant
    }
  }
`;

module.exports = {
  CONFIRM_TRANSACTION,
  INITIATE_HOSTED_PAYMENT,
  CANCEL_HOSTED_PAYMENT,
  CREATE_CUSTOMER,
  ADD_PAYMENT_METHOD,
  WITHDRAW_ONCHAIN,
  INITIATE_RAMP_QUOTE_DEPOSIT,
  INITIATE_RAMP_QUOTE_WITHDRAWAL,
  MARK_DEPOSIT_AS_PAID,
  MARK_WITHDRAWAL_AS_RECEIVED,
  CANCEL_DEPOSIT,
  BOT_AGENT_ACCEPT_WITHDRAWAL,
  BOT_AGENT_CANCEL_WITHDRAWAL,
  BOT_AGENT_MARK_DEPOSIT_AS_RECEIVED,
  BOT_AGENT_MARK_WITHDRAWAL_AS_PAID,
  BOT_AGENT_UPDATE_RATES,
  BOT_AGENT_UPDATE_PAYMENT_METHOD_LIQUIDITY,
};
