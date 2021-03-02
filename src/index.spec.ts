import { createClient } from './index';

const mockParams = {
  url: 'https://mockdata.com',
  username: 'username',
  password: 'password',
  clientId: 'clientId',
  secret: 'secret',
};
test('createClient', () => {
  const mockClient = createClient(mockParams);
  expect(mockClient).toBeDefined();
});

test('basic again', () => {
  expect(1 + 2).toBe(3);
});
