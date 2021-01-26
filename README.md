## Akeneo API

This is an unofficial attempt at a Node client for the Akeneo PIM REST API.

More info at https://api.akeneo.com/api-reference-index.html

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
});

console.log(await akeneo.productModels.getAll());
```
