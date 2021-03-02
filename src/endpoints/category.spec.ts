import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createError from 'axios/lib/core/createError';
import mockCategoryResponse from '../../mocks/category';

import { getOne, get, getAll } from './category';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Category', () => {
  test('get', async () => {
    jest.spyOn(axios, 'create').mockImplementation(() => axios);
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockCategoryResponse.get }),
      );

    const { items } = await get(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/categories', {
      params: {},
    });
    expect(items).toHaveLength(1);
  });

  test('getOne', async () => {
    jest.spyOn(axios, 'get').mockImplementation(async () => {
      return Promise.resolve({ data: mockCategoryResponse.getOne });
    });

    const category = await getOne(axios, { code: 'test' });
    expect(axios.get).toBeCalledWith('/api/rest/v1/categories/test', {
      params: {},
    });
    expect(category).toHaveProperty('labels');
  });

  test('Get with valid parameters', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
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
          },
          null,
          '  ',
        ),
      ),
    );
  });

  test('getAll', async () => {
    jest.spyOn(axios, 'get').mockImplementation(async () => {
      return Promise.resolve({ data: mockCategoryResponse.getAll });
    });

    const { items: categories } = await getAll(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/categories', {
      params: {
        limit: 100,
        page: 1,
        with_count: true,
      },
    });
    expect(categories).toHaveLength(1);
  });
});
