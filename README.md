![Gitlab code coverage](https://img.shields.io/gitlab/coverage/craftzing/akeneo-api/master)

![npm (scoped)](https://img.shields.io/npm/v/@craftzing/akeneo-api)

![NPM](https://img.shields.io/npm/l/@craftzing/akeneo-api)

## Akeneo API

This is an unofficial attempt at a Node client for the Akeneo PIM REST API.

More info at https://api.akeneo.com/api-reference-index.html

Note: not all endpoints are implements. Mostly only the GET are available. YMMV

### Features

- Easy typed access to your Akeneo environment
- Built in token handling
- Helper function to get all products or product models easily

### Installation

- run `yarn link` in this folder
- run `yarn link "akeneo-api"` in your project folder

### Your first request

```
import client from '@craftzing/akeneo-api';

const akeneo = client({
  baseURL,
  username,
  password,
  clientId,
  secret
  // Optionally you can also pass in axiosOptions which will be passed to the Axios instance
});

console.log(await akeneo.productModels.getAll());
```
