import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createError from 'axios/lib/core/createError';
import mockResponse from '../../mocks/product-model';
import mockError from '../../mocks/error';
import { getOne, get, getAll } from './product-model';

const axiosGetSpy = jest.spyOn(axios, 'get');
const mockFunction = (data: Record<string, any>) => async () =>
  Promise.resolve({ data });

afterEach(() => {
  jest.clearAllMocks();
});
describe('Product Model', () => {
  test('get product models', async () => {
    axiosGetSpy.mockImplementation(mockFunction(mockResponse.get));

    const { items } = await get(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/product-models', {});
    expect(items).toHaveLength(1);
  });

  test('getOne', async () => {
    axiosGetSpy.mockImplementation(mockFunction(mockResponse.getOne));

    const category = await getOne(axios, { code: 'test' });
    expect(axios.get).toBeCalledWith('/api/rest/v1/product-models/test', {});
    expect(category).toHaveProperty('family');
  });

  test('Get with valid parameters', async () => {
    axiosGetSpy.mockImplementation(mockFunction(mockResponse.get));

    await get(axios, {
      query: {
        search: '{"code":[{"operator":"IN","value":["code1","code2"]}]}',
      },
    });

    expect(axios.get).toBeCalledWith('/api/rest/v1/product-models', {
      params: {
        search: '{"code":[{"operator":"IN","value":["code1","code2"]}]}',
      },
    });
  });

  test('Get product models with invalid parameters', async () => {
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
    axiosGetSpy.mockImplementation(mockFunction(mockResponse.getAll));

    const { items: products } = await getAll(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/product-models', {
      params: {
        limit: 100,
      },
    });
    expect(products).toHaveLength(1);
  });
});
