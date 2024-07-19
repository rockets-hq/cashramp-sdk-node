const CONFIRM_TRANSACTION = `
  mutation ($paymentRequest: ID!, $transactionHash: String!) {
    confirmTransaction(paymentRequest: $paymentRequest, transactionHash: $transactionHash)
  }
`;

module.exports = {
  CONFIRM_TRANSACTION
}
