const CONFIRM_TRANSACTION = `
  mutation ($paymentRequest: ID!, $transactionHash: String!) {
    confirmTransaction(paymentRequest: $paymentRequest, transactionHash: $transactionHash)
  }
`;

const INITIATE_HOSTED_PAYMENT = `
  mutation ($amount: Decimal!, $currency: P2PPaymentCurrency, $countryCode: String!, $email: String!, $paymentType: P2PPaymentTypeType!, $reference: String!, $firstName: String!, $lastName: String!, $redirectUrl: String) {
    initiateHostedPayment(amount: $amount, currency: $currency, countryCode: $countryCode, email: $email, paymentType: $paymentType, reference: $reference, firstName: $firstName, lastName: $lastName, redirectUrl: $redirectUrl) {
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
  mutation ($customer: ID!, $paymentMethodType: ID!, $fields: [P2PPaymentMethodFieldInput!]!) {
    addPaymentMethod(customer: $customer, p2pPaymentMethodType: $paymentMethodType, fields: $fields) {
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
  mutation ($address: String!, $amountUsd: Decimal!) {
    withdrawOnchain(address: $address, amountUsd: $amountUsd) {
      id
      status
    }
  }
`;

module.exports = {
  CONFIRM_TRANSACTION,
  INITIATE_HOSTED_PAYMENT,
  CANCEL_HOSTED_PAYMENT,
  CREATE_CUSTOMER,
  ADD_PAYMENT_METHOD,
  WITHDRAW_ONCHAIN
}
