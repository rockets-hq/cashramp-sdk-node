const Cashramp = require('../src/index');

describe("Cashramp initialization", () => {
  const secretKey = "CSHRMP-SECK-123456789";

  test("it should correctly initialize defaults", () => {
    const client = new Cashramp({ secretKey });

    expect(client._env).toEqual("live");
    expect(client._secretKey).toEqual(secretKey);
    expect(client._apiURL).toEqual("https://api.useaccrue.com/cashramp/api/graphql")
  })

  test("it should correctly initialize in test env", () => {
    const env = "test";
    const client = new Cashramp({ env, secretKey });

    expect(client._env).toEqual(env);
    expect(client._secretKey).toEqual(secretKey);
    expect(client._apiURL).toEqual("https://staging.api.useaccrue.com/cashramp/api/graphql")
  })

  test("it should correctly initialize in live env", () => {
    const env = "live";
    const client = new Cashramp({ env, secretKey });

    expect(client._env).toEqual(env);
    expect(client._secretKey).toEqual(secretKey);
    expect(client._apiURL).toEqual("https://api.useaccrue.com/cashramp/api/graphql")
  })

  test("it should throw an error for invalid env", () => {
    try {
      const env = "development";
      new Cashramp({ env, secretKey });
    } catch (err) {
      expect(err.message).toEqual(`"development" is not a valid env. Can either be "test" or "live".`)
    }
  })

  test("it should throw an error if the secret key isn't provided", () => {
    try {
      new Cashramp({ secretKey: null });
    } catch (err) {
      expect(err.message).toEqual("Please provide your API secret key.")
    }
  })
})
