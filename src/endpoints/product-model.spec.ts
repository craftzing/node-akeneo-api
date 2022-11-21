import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createError from 'axios/lib/core/createError';
import mockError from '../../mocks/error.mock';
import mockResponse from '../../mocks/product-model.mock';
import { get, getAll, getOne } from './product-model';

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
    ).rejects.toThrow(new Error(JSON.stringify(mockError.response, null, 2)));
  });

  test('getAll', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockResponse.getAll }),
    );

    const { items: productModels } = await getAll(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/product-models', {
      params: {
        limit: 100,
        pagination_type: 'search_after',
      },
    });
    expect(productModels).toHaveLength(1);
  });

  test('getAll with pagination_type="page"', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockResponse.getAll }),
    );

    const { items: productModels } = await getAll(axios, {
      query: { pagination_type: 'page' },
    });
    expect(axios.get).toBeCalledWith('/api/rest/v1/product-models', {
      params: {
        limit: 100,
        page: 1,
        pagination_type: 'page',
        with_count: true,
      },
    });
    expect(productModels).toHaveLength(2);
  });
});
