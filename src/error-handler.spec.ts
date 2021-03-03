import { AxiosError } from 'axios';
import errorHandler from './error-handler';

import mockError from '../mocks/error';

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
      new Error(JSON.stringify(mockError.response, null, '  ')),
    );
  });

  test('Throws well formed error with Authorization', async () => {
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
      config: {
        headers: {
          Authorization: 'test-authorization',
        },
      },
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
            request: {
              headers: {
                Authorization: 'Bearer ...ation',
              },
            },
          },
          null,
          '  ',
        ),
      ),
    );
  });
});
