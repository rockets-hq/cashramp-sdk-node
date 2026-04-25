jest.mock("node-fetch");

const Cashramp = require("../src/index");
const { createGraphQLJSONResponse } = require("./index");

const BOT_ENDPOINT = "https://staging.api.useaccrue.com/cashramp/bot/graphql";
const MERCHANT_ENDPOINT =
  "https://staging.api.useaccrue.com/cashramp/api/graphql";

describe("Cashramp bot agent surface", () => {
  let client = null;
  let fetch = null;
  const secretKey = "CSHRMP-SECK-123456789";

  beforeEach(() => {
    client = new Cashramp({ secretKey, env: "test" });
    fetch = require("node-fetch");
  });

  test("it exposes both the merchant and bot endpoint URLs", () => {
    expect(client._apiURL).toBe(MERCHANT_ENDPOINT);
    expect(client._botApiURL).toBe(BOT_ENDPOINT);
  });

  test("getBotAgentProfile hits the bot endpoint and returns the profile", async () => {
    const name = "profile";
    const result = {
      id: "agent_1",
      email: "agent@useaccrue.com",
      accountBalance: "100.00",
    };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.getBotAgentProfile();
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const [url, init] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url).toBe(BOT_ENDPOINT);
    expect(init.body).toContain(name);
  });

  test("getBotAgentOrderHistory forwards page/perPage/filter and uses bot endpoint", async () => {
    const name = "orderHistory";
    const result = { data: [], pagination: { page: 1, perPage: 10, total: 0 } };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.getBotAgentOrderHistory({
      page: 2,
      perPage: 20,
      filter: { status: "completed" },
    });
    expect(response.success).toBeTruthy();

    const [url, init] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url).toBe(BOT_ENDPOINT);
    const body = JSON.parse(init.body);
    expect(body.variables).toEqual({
      page: 2,
      perPage: 20,
      filter: { status: "completed" },
    });
  });

  test("getBotAgentWithdrawalInfo forwards symbol and uses bot endpoint", async () => {
    const name = "withdrawalInfo";
    const result = { symbol: "USDC", networks: ["celo"] };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.getBotAgentWithdrawalInfo({ symbol: "USDC" });
    expect(response.success).toBeTruthy();

    const [url, init] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url).toBe(BOT_ENDPOINT);
    expect(JSON.parse(init.body).variables).toEqual({ symbol: "USDC" });
  });

  test("acceptBotAgentWithdrawal maps paymentRequest -> p2pPayment and hits bot endpoint", async () => {
    const name = "acceptWithdrawal";
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result: true }));

    const response = await client.acceptBotAgentWithdrawal({
      paymentRequest: "p2p_1",
    });
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(true);

    const [url, init] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url).toBe(BOT_ENDPOINT);
    const body = JSON.parse(init.body);
    expect(body.variables).toEqual({ p2pPayment: "p2p_1" });
    expect(body.query).toContain("acceptWithdrawal");
  });

  test("cancelBotAgentWithdrawal maps paymentRequest -> p2pPayment and hits bot endpoint", async () => {
    const name = "cancelWithdrawal";
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result: true }));

    const response = await client.cancelBotAgentWithdrawal({
      paymentRequest: "p2p_1",
    });
    expect(response.success).toBeTruthy();

    const [url, init] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url).toBe(BOT_ENDPOINT);
    expect(JSON.parse(init.body).variables).toEqual({ p2pPayment: "p2p_1" });
  });

  test("markBotAgentDepositReceived maps paymentRequest -> p2pPayment and hits bot endpoint", async () => {
    const name = "markDepositAsReceived";
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result: true }));

    const response = await client.markBotAgentDepositReceived({
      paymentRequest: "p2p_1",
    });
    expect(response.success).toBeTruthy();

    const [url, init] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url).toBe(BOT_ENDPOINT);
    expect(JSON.parse(init.body).variables).toEqual({ p2pPayment: "p2p_1" });
  });

  test("markBotAgentWithdrawalPaid forwards p2pPayment, paymentMethod, optional receipt", async () => {
    const name = "markWithdrawalAsPaid";
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result: true }));

    const response = await client.markBotAgentWithdrawalPaid({
      paymentRequest: "p2p_1",
      paymentMethod: "pm_1",
      receipt: "https://example.com/receipt.png",
    });
    expect(response.success).toBeTruthy();

    const [url, init] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url).toBe(BOT_ENDPOINT);
    expect(JSON.parse(init.body).variables).toEqual({
      p2pPayment: "p2p_1",
      paymentMethod: "pm_1",
      receipt: "https://example.com/receipt.png",
    });
  });

  test("updateBotAgentRates forwards only provided fields and hits bot endpoint", async () => {
    const name = "updateRates";
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result: true }));

    const response = await client.updateBotAgentRates({
      depositRate: 1500,
      withdrawalMargin: "0.01",
    });
    expect(response.success).toBeTruthy();

    const [url, init] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url).toBe(BOT_ENDPOINT);
    const variables = JSON.parse(init.body).variables;
    expect(variables.depositRate).toBe(1500);
    expect(variables.withdrawalMargin).toBe("0.01");
  });

  test("updateBotAgentPaymentMethodLiquidity sends amountLocal + paymentMethod and hits bot endpoint", async () => {
    const name = "updatePaymentMethodLiquidity";
    const result = { id: "pm_1", localCurrencyAvailable: "5000" };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.updateBotAgentPaymentMethodLiquidity({
      amountLocal: 5000,
      paymentMethod: "pm_1",
    });
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const [url, init] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url).toBe(BOT_ENDPOINT);
    expect(JSON.parse(init.body).variables).toEqual({
      amountLocal: 5000,
      paymentMethod: "pm_1",
    });
  });

  test("merchant methods continue to hit the merchant endpoint", async () => {
    fetch.mockReturnValue(
      createGraphQLJSONResponse({ name: "availableCountries", result: [] })
    );
    await client.getAvailableCountries();
    const [url] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url).toBe(MERCHANT_ENDPOINT);
  });
});
