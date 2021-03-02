import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createError from 'axios/lib/core/createError';
import mockError from '../../mocks/error';
import mockProductResponse from '../../mocks/product';

import { getOne, get, getAll } from './product';

const axiosGetSpy = jest.spyOn(axios, 'get');

const mockFunction = (data) => async () => Promise.resolve({ data });

afterEach(() => {
  jest.clearAllMocks();
});

describe('Product', () => {
  test('get products', async () => {
    axiosGetSpy.mockImplementation(mockFunction(mockProductResponse.get));

    const { items } = await get(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/products', {});
    expect(items).toHaveLength(1);
  });

  test('getOne', async () => {
    axiosGetSpy.mockImplementation(mockFunction(mockProductResponse.getOne));

    const category = await getOne(axios, { code: 'test' });
    expect(axios.get).toBeCalledWith('/api/rest/v1/products/test', {});
    expect(category).toHaveProperty('family');
  });

  test('Get with valid parameters', async () => {
    axiosGetSpy.mockImplementation(mockFunction(mockProductResponse.get));

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
    axiosGetSpy.mockImplementation(async () => {
      throw createError(...mockError.badRequest);
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
    axiosGetSpy.mockImplementation(async () =>
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
