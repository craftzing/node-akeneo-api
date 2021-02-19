/**
 * Akeneo Management API SDK. Allows you to create instances of a client
 * with access to the Akeneo API.
 */

/* eslint-disable no-underscore-dangle */
import { last } from "ramda";
import errorHandler from "./lib/error-handler";
import createHttpClient from "./lib/http-client";
import {
  ClientParams,
  ProductModel,
  Family,
  Variant,
  Attribute,
  EntityRecord,
  Category,
  AttributeOption,
  Asset,
  Entity,
  Product,
  AkeneoClient,
} from "./lib/types";

const CATEGORIES_PATH = "/api/rest/v1/categories";
const PRODUCT_MODEL_PATH = "/api/rest/v1/product-models";
const PRODUCT_PATH = "/api/rest/v1/products";
const ATTRIBUTES = "/api/rest/v1/attributes";
const ASSET_FAMILIES = "/api/rest/v1/asset-families";
const ASSET_MEDIA_FILES = "/api/rest/v1/asset-media-files";
const REFERENCE_ENTITIES_MEDIA_FILES =
  "/api/rest/v1/reference-entities-media-files";
const REFERENCE_ENTITIES = "/api/rest/v1/reference-entities";
const FAMILIES = "/api/rest/v1/families";

/**
 * Create a client instance
 * @param params - Client initialization parameters
 *
 * ```javascript
 * const client = akeneo({
 *   baseURL: AKENEO_API_URL,
 *   username: AKENEO_USERNAME,
 *   password: AKENEO_PASSWORD,
 *   clientId: AKENEO_CLIENT_ID,
 *   secret: AKENEO_SECRET,
 * });
 * ```
 */
export const createClient = (params: ClientParams): AkeneoClient => {
  const http = createHttpClient(params);

  const getBinary = async ({ path, id }: { path: string; id?: String }) => {
    try {
      const data = await http.get(`${path}${id ? "/" + id : ""}`, {
        responseType: "arraybuffer",
      });
      return data;
    } catch (error) {
      if (error.isAxiosError) {
        errorHandler(error);
      } else {
        throw error;
      }
    }
  };
  const getOne = async ({ path, code }: { path: string; code?: String }) => {
    try {
      const { data } = await http.get(`${path}${code ? "/" + code : ""}`);
      return data;
    } catch (error) {
      if (error.isAxiosError) {
        errorHandler(error);
      } else {
        throw error;
      }
    }
  };

  const get = async ({ path, search }: { path: string; search?: string }) => {
    try {
      const { data } = await http.get(`${path}`, {
        params: {
          search,
        },
      });
      return data._embedded.items;
    } catch (error) {
      if (error.isAxiosError) {
        errorHandler(error);
      } else {
        throw error;
      }
    }
  };

  const wrap = async (Fn: Function) => {
    try {
      return await Fn();
    } catch (error) {
      if (error.isAxiosError) {
        errorHandler(error);
      } else {
        throw error;
      }
    }
  };
  const getAllByPage = async ({
    path,
    page = 1,
    search,
  }: {
    search?: string;
    path: string;
    page?: number;
  }): Promise<any[]> => {
    const { data } = await http.get(path, {
      params: {
        with_count: true,
        limit: 100,
        page,
        search,
      },
    });
    if (data.items_count / 100 > page) {
      return [
        ...data._embedded.items,
        ...(await getAllByPage({ path, search, page: page + 1 })),
      ];
    }
    return data._embedded.items;
  };

  const getAllBySearchAfter = async ({
    path,
    searchAfter,
  }: {
    path: string;
    searchAfter?: string;
  }): Promise<any[]> => {
    const {
      data,
    }: {
      data: { _embedded: { items: any[] }; _links: any };
    } = await http.get(path, {
      params: {
        ...(searchAfter ? { search_after: searchAfter } : {}),
      },
    });
    const lastItem = last(data._embedded.items);
    console.log(data._links?.next?.href);
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
  };

  return {
    raw: {
      http,
    },
    category: {
      getOne: (code) => wrap(() => getOne({ path: CATEGORIES_PATH, code })),
      getAll: () => getAllByPage({ path: CATEGORIES_PATH }),
    },
    productModel: {
      getOne: (code) => getOne({ path: PRODUCT_MODEL_PATH, code }),
      get: (query) => get({ path: PRODUCT_MODEL_PATH, ...query }),
      getAll: (query) =>
        wrap(() => getAllByPage({ path: PRODUCT_MODEL_PATH, ...query })),
    },
    product: {
      getOne: (code) => getOne({ path: PRODUCT_PATH, code }),
      get: (query) => get({ path: PRODUCT_PATH, ...query }),
      getAll: (query) => getAllByPage({ path: PRODUCT_PATH, ...query }),
    },
    assetFamily: {
      getOne: (code) => getOne({ path: ASSET_FAMILIES, code }),
      get: () => get({ path: ASSET_FAMILIES }),
      getAll: () => getAllByPage({ path: ASSET_FAMILIES }),
    },
    assets: {
      getAll: (assetFamilyCode: string): Promise<Asset[]> =>
        getAllBySearchAfter({
          path: `${ASSET_FAMILIES}/${assetFamilyCode}/assets`,
        }),
      get: async (assetFamilyCode: string): Promise<Asset[]> =>
        await get({ path: `${ASSET_FAMILIES}/${assetFamilyCode}/assets` }),
      getOne: (assetFamilyCode: string, code: string): Promise<Asset[]> =>
        getOne({ path: `${ASSET_FAMILIES}/${assetFamilyCode}/assets`, code }),
    },
    assetMediaFiles: {
      get: async (code: string) =>
        getBinary({ path: ASSET_MEDIA_FILES, id: code }),
    },
    referenceEntitiesMediaFiles: {
      get: async (code: string) =>
        getBinary({
          path: REFERENCE_ENTITIES_MEDIA_FILES,
          id: code,
        }),
    },
    attributes: {
      get: () => get({ path: ATTRIBUTES }),
      getAll: () => getAllByPage({ path: ATTRIBUTES }),
      getOptions: (attribute) =>
        getAllByPage({ path: `${ATTRIBUTES}/${attribute}/options` }),
      add: async ({ code, attribute }) =>
        await http.patch(`${ATTRIBUTES}/${code}`, attribute),
      addOption: async ({ attributeCode, code, option }) =>
        await http.patch(
          `${ATTRIBUTES}/${attributeCode}/options/${code}`,
          option
        ),
    },
    referenceEntities: {
      get: (): Promise<Entity[]> => get({ path: REFERENCE_ENTITIES }),
      getRecords: (id: string): Promise<EntityRecord[]> =>
        get({ path: `${REFERENCE_ENTITIES}/${id}/records` }),
      add: async ({ code, body }) =>
        await http.patch(`/api/rest/v1/reference-entities/${code}`, body),
      addAttribute: async ({ referenceEntityCode, code, attribute }) => {
        const { data } = await http.patch(
          `/api/rest/v1/reference-entities/${referenceEntityCode}/attributes/${code}`,
          attribute
        );
      },
      addAttributeOption: async ({
        referenceEntityCode,
        attributeCode,
        code,
        option,
      }) => {
        const { data } = await http.patch(
          `/api/rest/v1/reference-entities/${referenceEntityCode}/attributes/${attributeCode}/options/${code}`,
          option
        );
      },
      addRecords: async ({ referenceEntityCode, records }) => {
        const { data } = await http.patch(
          `/api/rest/v1/reference-entities/${referenceEntityCode}/records`,
          records
        );
        console.log("data", data[0].errors);
      },
    },
    families: {
      get: () => get({ path: FAMILIES }),
      getVariants: (id: string): Promise<Variant[]> =>
        get({ path: `${FAMILIES}/${id}/variants` }),
    },
  };
};

export default createClient;

export {
  ClientParams,
  ProductModel,
  Family,
  Variant,
  Attribute,
  EntityRecord,
  Category,
  AttributeOption,
  Asset,
  Entity,
  Product,
  AkeneoClient,
};
