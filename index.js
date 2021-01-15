/* eslint-disable no-underscore-dangle */
import { last } from "ramda";
import errorHandler from "./lib/error-handler.js";
import createHttpClient from "./lib/http-client.js";

const CATEGORIES_PATH = "/api/rest/v1/categories";
const PRODUCT_MODEL_PATH = "/api/rest/v1/product-models";
const PRODUCT_PATH = "/api/rest/v1/products";
const ATTRIBUTES = "/api/rest/v1/attributes";
const ASSET_FAMILIES = "/api/rest/v1/asset-families";

export default (params) => {
  const http = createHttpClient(params);

  const get = async ({ path, id } = {}) => {
    try {
      const { data } = await http.get(`${path}/${id}`);
      return data;
    } catch (error) {
      if (error.isAxiosError) {
        errorHandler(error);
      } else {
        throw error;
      }
    }
  };

  const getAllByPage = async ({ path, page = 1 } = {}) => {
    try {
      const { data } = await http.get(path, {
        params: {
          with_count: true,
          limit: 100,
          page,
        },
      });
      if (data.items_count / 100 > page) {
        return [
          ...data._embedded.items,
          ...(await getAllByPage({ path, page: page + 1 })),
        ];
      }
      return data._embedded.items;
    } catch (error) {
      if (error.isAxiosError) {
        errorHandler(error);
      } else {
        throw error;
      }
    }
  };

  const getAllBySearchAfter = async ({ path, searchAfter }) => {
    try {
      const { data } = await http.get(path, {
        params: {
          ...(searchAfter ? { search_after: searchAfter } : {}),
        },
      });
      const lastItem = last(data._embedded.items);

      if (data._links?.next?.href) {
        return [
          ...data._embedded.items,
          ...(await getAllBySearchAfter({
            path,
            searchAfter: lastItem.code,
          })),
        ];
      }
      return data._embedded.items;
    } catch (error) {
      if (error.isAxiosError) {
        errorHandler(error);
      } else {
        throw error;
      }
    }
  };

  return {
    raw: {
      http,
    },
    category: {
      get: (id) => get({ path: CATEGORIES_PATH, id }),
      getAll: () => getAllByPage({ path: CATEGORIES_PATH }),
    },
    productModel: {
      get: (id) => get({ path: PRODUCT_MODEL_PATH, id }),
      getAll: () => getAllByPage({ path: PRODUCT_MODEL_PATH }),
    },
    product: {
      get: (id) => get({ path: PRODUCT_PATH, id }),
      getAll: () => getAllByPage({ path: PRODUCT_PATH }),
    },
    attribute: {
      getAll: () => getAllByPage({ path: ATTRIBUTES }),
    },
    attributeOption: {
      getAll: (attribute) =>
        getAllByPage({ path: `${ATTRIBUTES}/${attribute}/options` }),
    },
    assetFamily: {
      get: (code) => get({ path: ASSET_FAMILIES, id: code }),
      getAll: () => getAllByPage({ path: ASSET_FAMILIES }),
    },
    assets: {
      getAll: (assetFamilyCode) =>
        getAllBySearchAfter({
          path: `${ASSET_FAMILIES}/${assetFamilyCode}/assets`,
        }),
    },
  };
};
