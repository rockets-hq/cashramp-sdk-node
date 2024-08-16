jest.mock("node-fetch");

const Cashramp = require("../src/index");
const { createGraphQLJSONResponse } = require("./index");

describe("Cashramp mutations", () => {
  let client = null;
  let fetch = null;
  const secretKey = "CSHRMP-SECK-123456789";

  beforeEach(() => {
    client = new Cashramp({ secretKey, env: "test" });
    fetch = require("node-fetch");
  });

  test("it should confirm a transaction", async () => {
    const name = "confirmTransaction";
    const result = true;
    const payload = { paymentRequest: "1", transactionHash: "0xanwu" };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.confirmTransaction(payload);
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(
      JSON.stringify(payload)
    );
  });

  test("it should initiate a payment request", async () => {
    const name = "initiateHostedPayment";
    const result = {
      id: "1",
      hostedLink: "https://useaccrue.com",
      status: "completed",
    };
    const payload = {
      amount: 100,
      currency: "usd",
      countryCode: "GH",
      paymentType: "withdrawal",
      reference: "test_ref_1",
      redirectUrl: "https://google.com",
      firstName: "Clinton",
      lastName: "Mbah",
      email: "engineering@useaccrue.com",
    };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.initiateHostedPayment(payload);
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(
      JSON.stringify(payload)
    );
  });

  test("it should cancel a payment request", async () => {
    const name = "cancelHostedPayment";
    const result = true;
    const payload = { paymentRequest: "1" };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.cancelHostedPayment(payload);
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(
      JSON.stringify(payload)
    );
  });

  test("it should create a customer", async () => {
    const name = "createCustomer";
    const result = { id: "1" };
    const payload = {
      firstName: "Clinton",
      lastName: "Mbah",
      email: "engineering@useaccrue.com",
      country: "1",
    };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.createCustomer(payload);
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(
      JSON.stringify(payload)
    );
  });

  test("it should create a payment method for a customer", async () => {
    const name = "addPaymentMethod";
    const result = { id: "1" };
    const payload = {
      customer: "1",
      paymentMethodType: "1",
      fields: [{ identifier: "name", value: "Clinton Mbah" }],
    };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.addPaymentMethod(payload);
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(
      JSON.stringify(payload)
    );
  });

  test("it should withdraw onchain", async () => {
    const name = "withdrawOnchain";
    const result = { id: "1" };
    const payload = {
      address: "0xanwu",
      amountUsd: 100,
    };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.withdrawOnchain(payload);
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(
      JSON.stringify(payload)
    );
  });
});
