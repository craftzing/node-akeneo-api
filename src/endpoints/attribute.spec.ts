import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createError from 'axios/lib/core/createError';
import mockResponse from '../../../mocks/attribute';

import { getOne, get, getAll, getOptions } from './attribute';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Attribute', () => {
  test('get', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockResponse.get }),
      );

    const { items } = await get(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/attributes', {
      params: {},
    });
    expect(items).toHaveLength(1);
  });

  test('getOne', async () => {
    jest.spyOn(axios, 'get').mockImplementation(async () => {
      return Promise.resolve({ data: mockResponse.getOne });
    });

    const attribute = await getOne(axios, { code: 'test' });
    expect(axios.get).toBeCalledWith('/api/rest/v1/attributes/test', {});
    expect(attribute).toHaveProperty('group');
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

    try {
      await get(axios, { query: { search: 'test' } });
    } catch (error) {
      expect(axios.get).toBeCalledWith('/api/rest/v1/attributes', {
        params: { search: 'test' },
      });
      const parsedMessage = JSON.parse(error.message);
      expect(parsedMessage.message).toBe(
        'Search query parameter should be valid JSON.',
      );
    }
  });

  test('getAll', async () => {
    jest.spyOn(axios, 'get').mockImplementation(async () => {
      return Promise.resolve({ data: mockResponse.getAll });
    });

    const { items: attributes } = await getAll(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/attributes', {
      params: {
        limit: 100,
        page: 1,
        with_count: true,
      },
    });
    expect(attributes).toHaveLength(1);
  });

  test('getOptions', async () => {
    jest.spyOn(axios, 'get').mockImplementation(async () => {
      return Promise.resolve({ data: mockResponse.getAll });
    });

    const { items: attributes } = await getOptions(axios, {
      attributeCode: 'back_material',
    });
    expect(axios.get).toBeCalledWith(
      '/api/rest/v1/attributes/back_material/options',
      {},
    );
    expect(attributes).toHaveLength(1);
  });

  test('getOptions with params', async () => {
    jest.spyOn(axios, 'get').mockImplementation(async () => {
      return Promise.resolve({ data: mockResponse.getAll });
    });

    const { items: attributes } = await getOptions(axios, {
      attributeCode: 'back_material',
      query: {
        limit: 100,
      },
    });
    expect(axios.get).toBeCalledWith(
      '/api/rest/v1/attributes/back_material/options',
      {
        params: { limit: 100 },
      },
    );
    expect(attributes).toHaveLength(1);
  });
});
