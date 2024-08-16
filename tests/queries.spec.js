jest.mock("node-fetch");

const Cashramp = require("../src/index");
const { createGraphQLJSONResponse } = require("./index");

describe("Cashramp queries", () => {
  const { ACCOUNT } = require("../src/queries");

  let client = null;
  let fetch = null;
  const secretKey = "CSHRMP-SECK-123456789";

  beforeEach(() => {
    client = new Cashramp({ secretKey, env: "test" });
    fetch = require("node-fetch");
  });

  test("it should correctly send a request", async () => {
    const name = "account";
    const result = {
      accountBalance: "10",
      depositAddress: "0x17A08127364A7C897e557611176A73Eef5642C81",
    };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.sendRequest({
      name,
      query: ACCOUNT,
    });

    expect(response.success).toBeTruthy();
    expect(response.result.accountBalance).toEqual(result.accountBalance);
    expect(response.result.depositAddress).toEqual(result.depositAddress);

    expect(fetch.mock.calls[0][0]).toEqual(client._apiURL);
    expect(fetch.mock.calls[0][1].method).toEqual("post");
    expect(fetch.mock.calls[0][1].body).toContain(name);
    expect(fetch.mock.calls[0][1].headers["Authorization"]).toEqual(
      `Bearer ${secretKey}`
    );
  });

  test("it should correctly return API errors", async () => {
    const name = "account";
    const error = "Your account has been restricted.";
    fetch.mockReturnValue(
      createGraphQLJSONResponse({
        name,
        error,
      })
    );

    const response = await client.sendRequest({
      name,
      query: ACCOUNT,
    });

    expect(response.success).toBeFalsy();
    expect(response.result).toBeFalsy();
    expect(response.error).toBe(error);
  });

  test("it should get available countries", async () => {
    const name = "availableCountries";
    const result = [{ id: "1", name: "Ghana", code: "GH" }];
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.getAvailableCountries();
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
  });

  test("it should get the market rate", async () => {
    const name = "marketRate";
    const countryCode = "GH";
    const result = { depositRate: "1000", withdrawalRate: "999" };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.getMarketRate({ countryCode });
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(
      JSON.stringify({ countryCode })
    );
  });

  test("it should get the payment method types for a country", async () => {
    const name = "p2pPaymentMethodTypes";
    const country = "1";
    const result = [
      {
        id: "1",
        identifier: "mtn_momo",
        fields: [
          { label: "Name", identifier: "name", required: true },
          { label: "Phone Number", identifier: "phone_number", required: true },
        ],
      },
    ];
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.getPaymentMethodTypes({ country });
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(
      JSON.stringify({ country })
    );
  });

  test("it should get the rampable assets", async () => {
    const name = "rampableAssets";
    const result = [
      {
        name: "USDT",
        symbol: "USDT",
        networks: ["TRX", "CELO"],
        contractAddress: { TRX: "", CELO: "" },
      },
    ];
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.getRampableAssets();
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
  });

  test("it should get the ramp limits", async () => {
    const name = "rampLimits";
    const result = { minimumDepositUsd: 2 };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.getRampLimits();
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
  });

  test("it should get a payment request", async () => {
    const name = "merchantPaymentRequest";
    const reference = "test_ref_1";
    const result = {
      id: "1",
      status: "completed",
      reference,
      hostedLink:
        "https://useaccrue.com/hosted/pay/VHlwZXM6OkNhc2hyYW1wOjpBUEk6Ok1lcmNoYW50UGF5bWVudFJlcXVlc3QtYTgwMWQ1NjAtOTYyYi00MjJkLWEyYzItZjY2NzZhZGE4NDY5",
    };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.getPaymentRequest({ reference });
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(
      JSON.stringify({ reference })
    );
  });

  test("it should get an account's details", async () => {
    const name = "account";
    const result = { id: "1", accountBalance: "1000" };
    fetch.mockReturnValue(createGraphQLJSONResponse({ name, result }));

    const response = await client.getAccount();
    expect(response.success).toBeTruthy();
    expect(response.result).toBe(result);

    const mockCallIndex = fetch.mock.calls.length - 1;
    expect(fetch.mock.calls[mockCallIndex][1].body).toContain(name);
  });
});
