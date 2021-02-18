## Akeneo API

This is an unofficial attempt at a Node client for the Akeneo PIM REST API.

More info at https://api.akeneo.com/api-reference-index.html

### Features

- Easy typed access to your Akeneo environment
- Built in token handlinge

### Installation

- run `yarn link` in this folder
- run `yarn link "akeneo-api"` in your project folder

### Your first request

```
import client from 'akeneo-api';

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
