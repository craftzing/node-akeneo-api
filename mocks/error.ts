export default {
  badRequest: [
    'Request failed with status code 400',
    { params: { search: 'test' } },
    null,
    {},
    {
      status: 400,
      statusText: 'Bad request',
      data: {
        code: 400,
        message: 'Search query parameter should be valid JSON.',
      },
      headers: {},
      config: {},
    },
  ],
  response: {
    status: 400,
    statusText: 'Bad request',
    message: 'Search query parameter should be valid JSON.',
    details: {},
    request: {},
  },
};
