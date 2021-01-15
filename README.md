## Akeneo API

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
