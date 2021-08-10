[![Node Akeneo API](https://github.com/craftzing/node-akeneo-api/raw/master/art/banner.jpg)](https://craftzing.com)

[![Quality assurance](https://github.com/craftzing/node-akeneo-api/actions/workflows/quality-assurance.yml/badge.svg?branch=master)](https://github.com/craftzing/node-akeneo-api/actions/workflows/quality-assurance.yml)
[![Code style](https://github.com/craftzing/node-akeneo-api/actions/workflows/code-style.yml/badge.svg?branch=master)](https://github.com/craftzing/node-akeneo-api/actions/workflows/code-style.yml)
[![Test Coverage](https://api.codeclimate.com/v1/badges/90013a42a4dce3766813/test_coverage)](https://codeclimate.com/github/craftzing/akeneo-api/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/90013a42a4dce3766813/maintainability)](https://codeclimate.com/github/craftzing/akeneo-api/maintainability)
![Software License](https://img.shields.io/github/license/craftzing/node-akeneo-api)
[![js-airbnb-style](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg)](https://github.com/airbnb/javascript/)
![npm (scoped)](https://img.shields.io/npm/v/@craftzing/akeneo-api)

# Akeneo API

This is an unofficial Node client for the Akeneo PIM REST API.

More info at [Akeneo REST API reference](https://api.akeneo.com/api-reference-index.html)

Note: not all endpoints are implements. Mostly only the GET are available. YMMV

## 🔥 Features

- Easy typed access to your Akeneo environment via Typescript
- Built in token handling
- Helper function to get all products or product models easily

## ⚒️ Requirements

- node.js ([LTS](https://nodejs.org/en/about/releases/))

## 🧙 Installation

Using npm:

```sh
npm install @craftzing/akeneo-api
```

Using yarn:

```sh
yarn add @craftzing/akeneo-api
```

## ⚙️ Configuration

### Authentication

Follow the instructions for your Akeneo version to get the required parameters:

- clientId/secret: [client-idsecret-generation](https://api.akeneo.com/documentation/authentication.html#client-idsecret-generation)
- username/password: [api-user-creation](https://api.akeneo.com/documentation/authentication.html#api-user-creation)

### Your first request

With es6 imports

```js
import client from '@craftzing/akeneo-api';

const akeneo = client({
  url,
  username,
  password,
  clientId,
  secret,
  // Optionally you can also pass in axiosOptions which will be passed to the Axios instance
});

console.log(await akeneo.productModel.getAll({}));
```

## 📚 Docs

- [docs](https://craftzing.github.io/node-akeneo-api/)

## 📝 Changelog

You can check the changelog on the [releases](https://github.com/craftzing/node-akeneo-api/releases) page.

## 🤝 Support

If you have a problem with this library, please file an [issue](https://github.com/craftzing/akeneo-api/issues/new) here on GitHub.

If you have other problems with Akeneo not related to this library, you can contact their [Customer Support](https://www.akeneo.com/support/).

## 💙 Thanks to...

- [The entire Craftzing team](https://craftzing.com)
- [All current and future contributors](https://github.com/craftzing/node-akeneo-api/graphs/contributors)

## 🔑 License

The MIT License (MIT). Please see [License File](/LICENSE) for more information.
