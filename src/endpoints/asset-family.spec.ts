import axios from 'axios';

import mockResponse from '../../mocks/asset-family.mock';

import {
  getOne,
  get,
  getAll,
  getAssets,
  getAsset,
  getAssetsAll,
} from './asset-family';

const axiosGetSpy = jest.spyOn(axios, 'get');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Asset Family', () => {
  test('get', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockResponse.get }),
    );

    const { items } = await get(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/asset-families', {
      params: {},
    });
    expect(items).toHaveLength(1);
  });

  test('getOne', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockResponse.getOne }),
    );

    const assetFamily = await getOne(axios, { code: 'test' });
    expect(axios.get).toBeCalledWith('/api/rest/v1/asset-families/test', {});
    expect(assetFamily).toHaveProperty('code');
  });

  test('getAll', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockResponse.getAll }),
    );

    const { items: assetFamilies } = await getAll(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/asset-families', {
      params: {
        limit: 100,
        pagination_type: 'search_after',
      },
    });
    expect(assetFamilies).toHaveLength(1);
  });

  test('getAssets', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: { _embedded: {} } }),
    );

    await getAssets(axios, { assetFamilyCode: 'test' });
    expect(axios.get).toBeCalledWith(
      '/api/rest/v1/asset-families/test/assets',
      {},
    );
  });

  test('getAssetsAll', async () => {
    axiosGetSpy.mockImplementationOnce(async () =>
      Promise.resolve({ data: mockResponse.getAssetsAll[0] }),
    );
    axiosGetSpy.mockImplementationOnce(async () =>
      Promise.resolve({ data: mockResponse.getAssetsAll[1] }),
    );

    await getAssetsAll(axios, { assetFamilyCode: 'test' });
    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      '/api/rest/v1/asset-families/test/assets',
      { params: { limit: 100, pagination_type: 'search_after' } },
    );
    expect(axios.get).toHaveBeenNthCalledWith(
      2,
      '/api/rest/v1/asset-families/test/assets',
      {
        params: {
          limit: 100,
          pagination_type: 'search_after',
          search_after: 'alr195t',
        },
      },
    );
  });

  test('getAsset', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: { _embedded: {} } }),
    );

    await getAsset(axios, { assetFamilyCode: 'test', code: 'assetcode' });
    expect(axios.get).toBeCalledWith(
      '/api/rest/v1/asset-families/test/assets/assetcode',
      {},
    );
  });
});
