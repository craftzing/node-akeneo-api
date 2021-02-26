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
} from "./lib/types";

import * as endpoints from "./lib/endpoints";
import { AxiosInstance } from "axios";

const ATTRIBUTES_PATH = "/api/rest/v1/attributes";
const ASSET_MEDIA_FILES = "/api/rest/v1/asset-media-files";
const REFERENCE_ENTITIES_MEDIA_FILES =
  "/api/rest/v1/reference-entities-media-files";

export type AkeneoClientAPI = ReturnType<typeof createClient>;

type EndpointDefinition<P extends {}, R> = (
  http: AxiosInstance,
  params: P
) => R;

const wrap = <P extends {}, R>(
  http: AxiosInstance,
  fn: EndpointDefinition<P, R>
) => (params: P) => fn(http, params);

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

  const getAllBySearchAfter = async ({
    path,
    searchAfter,
  }: {
    path: string;
    searchAfter?: string;
  }): Promise<{ items: any[] }> => {
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
      return {
        items: [
          ...data._embedded.items,
          ...(
            await getAllBySearchAfter({
              path,
              searchAfter: lastItem.code,
            })
          ).items,
        ],
      };
    }
    return { items: data._embedded.items };
  };

  return {
    raw: {
      http,
    },
    category: {
      getOne: wrap(http, endpoints.category.getOne),
      get: wrap(http, endpoints.category.get),
      getAll: wrap(http, endpoints.category.getAll),
    },
    productModel: {
      getOne: wrap(http, endpoints.productModel.getOne),
      get: wrap(http, endpoints.productModel.get),
      getAll: wrap(http, endpoints.productModel.getAll),
    },
    product: {
      getOne: wrap(http, endpoints.product.getOne),
      get: wrap(http, endpoints.product.get),
      getAll: wrap(http, endpoints.product.getAll),
    },
    assetFamily: {
      getOne: wrap(http, endpoints.assetFamily.getOne),
      get: wrap(http, endpoints.assetFamily.get),
      getAll: wrap(http, endpoints.assetFamily.getAll),
    },
    asset: {
      getOne: wrap(http, endpoints.asset.getOne),
      get: wrap(http, endpoints.asset.get),
      getAll: wrap(http, endpoints.asset.getAll),
    },
    assetMediaFiles: {
      get: async (code: string) =>
        getBinary({ path: ASSET_MEDIA_FILES, id: code }),
    },
    referenceEntitiesMediaFiles: {
      /**
       * @see https://api.akeneo.com/api-reference.html#get_reference_entity_media_files__code
       */
      get: async (code: string): Promise<any> =>
        getBinary({
          path: REFERENCE_ENTITIES_MEDIA_FILES,
          id: code,
        }),
    },
    attribute: {
      getOne: wrap(http, endpoints.attribute.getOne),
      get: wrap(http, endpoints.attribute.get),
      getAll: wrap(http, endpoints.attribute.getAll),
      getOptions: wrap(http, endpoints.attribute.getOptions),
      add: async ({ code, attribute }: { code: string; attribute: any }) =>
        await http.patch(`${ATTRIBUTES_PATH}/${code}`, attribute),
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
          `${ATTRIBUTES_PATH}/${attributeCode}/options/${code}`,
          option
        ),
    },
    referenceEntities: {
      get: wrap(http, endpoints.referenceEntity.get),
      getRecords: wrap(http, endpoints.referenceEntity.getRecords),
      /**
       * @see https://api.akeneo.com/api-reference.html#patch_reference_entity__code_
       */ add: async ({ code, body }: { code: string; body: any }) =>
        await http.patch(`/api/rest/v1/reference-entities/${code}`, body),
      /**
       * @see https://api.akeneo.com/api-reference.html#patch_reference_entity_attributes__code_
       */
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
      /**
       * @see https://api.akeneo.com/api-reference.html#patch_reference_entity_attributes__attribute_code__options__code_
       */
      addAttributeOption: ({
        referenceEntityCode,
        attributeCode,
        code,
        option,
      }: {
        referenceEntityCode: string;
        attributeCode: string;
        code: string;
        option: any;
      }) =>
        http.patch(
          `/api/rest/v1/reference-entities/${referenceEntityCode}/attributes/${attributeCode}/options/${code}`,
          option
        ),
      /**
       * @see https://api.akeneo.com/api-reference.html#patch_reference_entity_records
       */
      addRecords: ({
        referenceEntityCode,
        records,
      }: {
        referenceEntityCode: string;
        records: any[];
      }) =>
        http.patch(
          `/api/rest/v1/reference-entities/${referenceEntityCode}/records`,
          records
        ),
    },
    family: {
      get: wrap(http, endpoints.family.get),
      getVariants: wrap(http, endpoints.family.getVariants),
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
};
