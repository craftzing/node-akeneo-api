import axios from 'axios';

import mockFamilyResponse from '../../mocks/family.mock';

import { get, getVariants } from './family';

const axiosGetSpy = jest.spyOn(axios, 'get');

afterEach(() => {
  jest.clearAllMocks();
});
describe('Family', () => {
  test('get families', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockFamilyResponse.get }),
    );

    const { items } = await get(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/families', {
      params: {},
    });
    expect(items).toHaveLength(1);
  });

  test('get variants', async () => {
    axiosGetSpy.mockImplementation(async () =>
      Promise.resolve({ data: mockFamilyResponse.get }),
    );

    const { items } = await getVariants(axios, { familyCode: 'cushions' });
    expect(axios.get).toBeCalledWith(
      '/api/rest/v1/families/cushions/variants',
      {
        params: {},
      },
    );
    expect(items).toHaveLength(1);
  });
});
