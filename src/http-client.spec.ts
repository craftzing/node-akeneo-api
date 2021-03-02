import axios from 'axios';
import createHttpClient from './http-client';
const mockParams = {
  url: 'https://mockdata.com',
  username: 'username',
  password: 'password',
  clientId: 'clientId',
  secret: 'secret',
};

describe('http client', () => {
  test('Create Axios client', async () => {
    const http = createHttpClient(mockParams);
    expect(http).toBeDefined();
  });

  test('Create Axios client + request', async () => {
    jest.spyOn(axios, 'post');
    const http = createHttpClient(mockParams);
    try {
      await http.get('test');
      // eslint-disable-next-line no-empty
    } catch (error) {}

    expect(axios.post).toHaveBeenCalledWith(
      'https://mockdata.com/api/oauth/v1/token',
      {
        grant_type: 'password',
        password: 'password',
        username: 'username',
      },
      {
        headers: {
          Authorization: 'Basic Y2xpZW50SWQ6c2VjcmV0',
        },
      },
    );
  });
});
