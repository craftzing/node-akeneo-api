import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createError from 'axios/lib/core/createError';
import mockProductResponse from '../../mocks/product';

import { getOne, get, getAll } from './product';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Product', () => {
  test('get products', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockProductResponse.get }),
      );

    const { items } = await get(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/products', {});
    expect(items).toHaveLength(1);
  });

  test('getOne', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockProductResponse.getOne }),
      );

    const category = await getOne(axios, { code: 'test' });
    expect(axios.get).toBeCalledWith('/api/rest/v1/products/test', {});
    expect(category).toHaveProperty('family');
  });

  test('Get with valid parameters', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockProductResponse.get }),
      );

    await get(axios, {
      query: {
        search: '{"main_color":[{"operator":"IN","value":["purple"]}]}',
      },
    });

    expect(axios.get).toBeCalledWith('/api/rest/v1/products', {
      params: {
        search: '{"main_color":[{"operator":"IN","value":["purple"]}]}',
      },
    });
  });

  test('Get with invalid parameters', async () => {
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

    await expect(() =>
      get(axios, { query: { search: 'test' } }),
    ).rejects.toThrow(
      new Error(
        JSON.stringify(
          {
            status: 400,
            statusText: 'Bad request',
            message: 'Search query parameter should be valid JSON.',
            details: {},
            request: {},
          },
          null,
          '  ',
        ),
      ),
    );
  });

  test('getAll', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockProductResponse.getAll }),
      );

    const { items: products } = await getAll(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/products', {
      params: {
        limit: 100,
        page: 1,
        with_count: true,
      },
    });
    expect(products).toHaveLength(1);
  });
});
