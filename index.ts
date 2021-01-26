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
} from "./lib/types";

const CATEGORIES_PATH = "/api/rest/v1/categories";
const PRODUCT_MODEL_PATH = "/api/rest/v1/product-models";
const PRODUCT_PATH = "/api/rest/v1/products";
const ATTRIBUTES = "/api/rest/v1/attributes";
const ASSET_FAMILIES = "/api/rest/v1/asset-families";
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
export const createClient = (params: ClientParams) => {
  const http = createHttpClient(params);

  const get = async ({ path, id }: { path: string; id?: String }) => {
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

  const getMany = async ({ path }: { path: string }) => {
    try {
      const { data } = await http.get(`${path}`);
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
  }: {
    path: string;
    page?: number;
  }): Promise<any[]> => {
    // try {
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
    // } catch (error) {
    //   if (error.isAxiosError) {
    //     errorHandler(error);
    //   } else {
    //     throw error;
    //   }
    // }
  };

  const getAllBySearchAfter = async ({
    path,
    searchAfter,
  }: {
    path: string;
    searchAfter?: string;
  }): Promise<any[]> => {
    // try {
    const {
      data,
    }: { data: { _embedded: { items: any[] }; _links: any } } = await http.get(
      path,
      {
        params: {
          ...(searchAfter ? { search_after: searchAfter } : {}),
        },
      }
    );
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
    // } catch (error) {
    //   if (error.isAxiosError) {
    //     errorHandler(error);
    //   } else {
    //     throw error;
    //   }
    // }
  };

  return {
    raw: {
      http,
    },
    category: {
      get: (id: string): Promise<Category> =>
        wrap(() => get({ path: CATEGORIES_PATH, id })),
      getAll: (): Promise<Category[]> =>
        getAllByPage({ path: CATEGORIES_PATH }),
    },
    productModel: {
      get: (id: string): Promise<ProductModel> =>
        get({ path: PRODUCT_MODEL_PATH, id }),
      getAll: (): Promise<ProductModel[]> =>
        wrap(() => getAllByPage({ path: PRODUCT_MODEL_PATH })),
    },
    product: {
      get: (id: string) => get({ path: PRODUCT_PATH, id }),
      getAll: () => getAllByPage({ path: PRODUCT_PATH }),
    },
    attributeOption: {
      getAll: (attribute: string) =>
        getAllByPage({ path: `${ATTRIBUTES}/${attribute}/options` }),
    },
    assetFamily: {
      get: (code: string) => get({ path: ASSET_FAMILIES, id: code }),
      getAll: () => getAllByPage({ path: ASSET_FAMILIES }),
    },
    assets: {
      getAll: (assetFamilyCode: string) =>
        getAllBySearchAfter({
          path: `${ASSET_FAMILIES}/${assetFamilyCode}/assets`,
        }),
    },
    referenceEntities: {
      getMany: () => getMany({ path: REFERENCE_ENTITIES }),
      getRecords: (id: string): Promise<EntityRecord[]> =>
        getMany({ path: `${REFERENCE_ENTITIES}/${id}/records` }),

      add: async ({ code, body }: { code: string; body: any }) =>
        await http.patch(`/api/rest/v1/reference-entities/${code}`, body),
      addAttribute: async ({
        referenceEntityCode,
        code,
        attribute,
      }: {
        referenceEntityCode: string;
        code: string;
        attribute: any;
      }) => {
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
      }: {
        referenceEntityCode: string;
        attributeCode: string;
        code: string;
        option: any;
      }) => {
        const { data } = await http.patch(
          `/api/rest/v1/reference-entities/${referenceEntityCode}/attributes/${attributeCode}/options/${code}`,
          option
        );
      },
      addRecords: async ({
        referenceEntityCode,
        records,
      }: {
        referenceEntityCode: string;
        records: any[];
      }) => {
        const { data } = await http.patch(
          `/api/rest/v1/reference-entities/${referenceEntityCode}/records`,
          records
        );
        console.log("data", data[0].errors);
      },
    },
    families: {
      getMany: (): Promise<Family[]> => getMany({ path: FAMILIES }),
      getVariants: (id: string): Promise<Variant[]> =>
        getMany({ path: `${FAMILIES}/${id}/variants` }),
    },
    attributes: {
      add: async ({ code, attribute }: { code: string; attribute: any }) =>
        await http.patch(`${ATTRIBUTES}/${code}`, attribute),
      addOption: async ({
        attributeCode,
        code,
        option,
      }: {
        attributeCode: string;
        code: string;
        option: any;
      }) =>
        await http.patch(
          `${ATTRIBUTES}/${attributeCode}/options/${code}`,
          option
        ),

      getAll: (): Promise<Attribute[]> => getAllByPage({ path: ATTRIBUTES }),
    },
  };
};

export default createClient;
