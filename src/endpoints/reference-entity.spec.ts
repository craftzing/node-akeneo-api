import axios from 'axios';

import mockResponse from '../../mocks/reference-entity';

import { get, getRecords } from './reference-entity';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Reference Entity', () => {
  test('get', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockResponse.get }),
      );

    const { items } = await get(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/reference-entities', {});
    expect(items).toHaveLength(1);
  });

  test('getRecords', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockResponse.get }),
      );

    const { items } = await getRecords(axios, {
      referenceEntityCode: 'testcode',
    });
    expect(axios.get).toBeCalledWith(
      '/api/rest/v1/reference-entities/testcode/records',
      {},
    );
    expect(items).toHaveLength(1);
  });
});
