function createGraphQLJSONResponse({ name, result, error, status }) {
  status = status || 200;

  return {
    status,
    json: async () => ({
      data: {
        [name]: result,
      },
      errors: error ? [{ message: error }] : null,
    }),
  };
}

module.exports = { createGraphQLJSONResponse };
