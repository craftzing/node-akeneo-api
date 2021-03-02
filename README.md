![npm (scoped)](https://img.shields.io/npm/v/@craftzing/akeneo-api)
![NPM](https://img.shields.io/npm/l/@craftzing/akeneo-api)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/craftzing/akeneo-api/master)
[![js-airbnb-style](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg)](https://github.com/airbnb/javascript/)

# Akeneo API

This is an unofficial Node client for the Akeneo PIM REST API.

More info at [Akeneo REST API reference](https://api.akeneo.com/api-reference-index.html)

Note: not all endpoints are implements. Mostly only the GET are available. YMMV

## Features

- Easy typed access to your Akeneo environment
- Built in token handling
- Helper function to get all products or product models easily

## Supported Environments

- node.js ([LTS](https://nodejs.org/en/about/releases/))

## Installation

Using npm:

```sh
npm install @craftzing/akeneo-api
```

Using yarn:

```sh
yarn add @craftzing/akeneo-api
```

## Authentication

Follow the instructions for your Akeneo version to get the required parameters:

- clientId/secret: [client-idsecret-generation](https://api.akeneo.com/documentation/authentication.html#client-idsecret-generation)
- username/password: [api-user-creation](https://api.akeneo.com/documentation/authentication.html#api-user-creation)

## Your first request

With es6 imports

```js
import client from '@craftzing/akeneo-api';

const akeneo = client({
  baseURL,
  username,
  password,
  clientId,
  secret,
  // Optionally you can also pass in axiosOptions which will be passed to the Axios instance
});

console.log(await akeneo.productModels.getAll());
```

## Documentation

TODO: publish documentation.
Available locally by running

```sh
yarn run build:docs
```

You can find the documentation in the docs directory

## Support

If you have a problem with this library, please file an [issue](https://github.com/craftzing/akeneo-api/issues/new) here on GitHub.

If you have other problems with Akeneo not related to this library, you can contact their [Customer Support](https://www.akeneo.com/support/).

## Versioning

This project strictly follows [Semantic Versioning](http://semver.org/) by use of [semantic-release](https://github.com/semantic-release/semantic-release).

TODO: use sematic-release

You can check the changelog on the [releases](https://github.com/contentful/contentful-management.js/releases) page.

## License

MIT
