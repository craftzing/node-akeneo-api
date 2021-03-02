import { AxiosError } from 'axios';
import errorHandler from './error-handler';

describe('errorHandler', () => {
  test('Throws well formed error', async () => {
    const errorMock: AxiosError = {
      isAxiosError: true,
      name: '',
      message: '',
      response: {
        status: 400,
        statusText: 'Bad request',
        data: {
          code: 400,
          message: 'Search query parameter should be valid JSON.',
        },
        headers: {},
        config: {},
      },
      config: {},
      toJSON: (): any => ({}),
    };

    expect(() => errorHandler(errorMock)).toThrow(
      new Error(
        JSON.stringify(
          {
            status: 400,
            statusText: 'Bad request',
            message: 'Search query parameter should be valid JSON.',
            details: {},
          },
          null,
          '  ',
        ),
      ),
    );
  });
});
