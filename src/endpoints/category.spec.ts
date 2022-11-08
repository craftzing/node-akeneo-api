import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createError from 'axios/lib/core/createError';
import mockError from '../../mocks/error';
import mockCategoryResponse from '../../mocks/category';

import { getOne, get, getAll } from './category';

const axiosGetSpy = jest.spyOn(axios, 'get');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Category', () => {
  test('get', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockCategoryResponse.get }),
    );

    const { items } = await get(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/categories', {
      params: {},
    });
    expect(items).toHaveLength(1);
  });

  test('getOne', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockCategoryResponse.getOne }),
    );

    const category = await getOne(axios, { code: 'test' });
    expect(axios.get).toBeCalledWith('/api/rest/v1/categories/test', {
      params: {},
    });
    expect(category).toHaveProperty('labels');
  });

  test('Get with valid parameters', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockCategoryResponse.get }),
    );

    await get(axios, {
      query: {
        search: '{"code":[{"operator":"IN","value":["code1","code2"]}]}',
      },
    });

    expect(axios.get).toBeCalledWith('/api/rest/v1/categories', {
      params: {
        search: '{"code":[{"operator":"IN","value":["code1","code2"]}]}',
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
      new Error(JSON.stringify(mockError.response, null, '  ')),
    );
  });

  test('getAll', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockCategoryResponse.getAll }),
    );

    const { items: categories } = await getAll(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/categories', {
      params: {
        limit: 100,
      },
    });
    expect(categories).toHaveLength(1);
  });
});
