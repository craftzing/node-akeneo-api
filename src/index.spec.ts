import { createClient } from '../src/index';
import axios from 'axios';

// import enhanceError from "axios/lib/core/enhanceError";

import createError from 'axios/lib/core/createError';
import mockCategoryResponse from '../mocks/categories';

// const mockAxios: AxiosStatic = jest.genMockFromModule("axios");
// mockAxios.create = jest.fn(() => {
//   return mockAxios;
// });

const mockParams = {
  url: 'https://mockdata.com',
  username: 'username',
  password: 'password',
  clientId: 'clientId',
  secret: 'secret',
};
test('createClient', () => {
  const mockClient = createClient(mockParams);
  expect(mockClient).toBeDefined();
});

describe('Category', () => {
  test('get', async () => {
    jest.spyOn(axios, 'create').mockImplementation(() => axios);
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockCategoryResponse.get }),
      );
    const mockClient = createClient(mockParams);

    const { items } = await mockClient.category.get({});
    expect(items).toHaveLength(1);
  });

  test('getOne', async () => {
    jest.spyOn(axios, 'create').mockImplementation(() => axios);
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockCategoryResponse.getOne }),
      );
    const mockClient = createClient(mockParams);

    const category = await mockClient.category.getOne({ code: 'test' });
    expect(category).toHaveProperty('labels');
  });

  test('Get with invalid parameters', async () => {
    jest.spyOn(axios, 'create').mockImplementation(() => axios);

    jest.spyOn(axios, 'get').mockImplementation(async () => {
      throw createError(
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
      );
    });
    const mockClient = createClient(mockParams);

    try {
      await mockClient.category.get({ query: { search: 'test' } });
    } catch (error) {
      // console.log(error);
      const parsedMessage = JSON.parse(error.message);
      expect(parsedMessage.message).toBe(
        'Search query parameter should be valid JSON.',
      );
    }
    // expect(items).toHaveLength(1);
  });
});

test('basic again', () => {
  expect(1 + 2).toBe(3);
});
