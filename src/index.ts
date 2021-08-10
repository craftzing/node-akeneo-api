/**
 * Akeneo Management API SDK. Allows you to create instances of a client
 * with access to the Akeneo API.
 */

/* eslint-disable no-underscore-dangle */
import { AxiosInstance } from 'axios';
import createHttpClient from './http-client';
import { ClientParams } from './types';

import * as endpoints from './endpoints';

const ATTRIBUTES_PATH = '/api/rest/v1/attributes';
const ASSET_MEDIA_FILES = '/api/rest/v1/asset-media-files';
const REFERENCE_ENTITIES_MEDIA_FILES =
  '/api/rest/v1/reference-entities-media-files';

type EndpointDefinition<P extends Record<string, any>, R> = (
  http: AxiosInstance,
  params: P,
) => R;

const wrap = <P extends Record<string, any>, R>(
  http: AxiosInstance,
  fn: EndpointDefinition<P, R>,
) => (params: P) => fn(http, params);

/**
 * Create a client instance
 * @param params - Client initialization parameters
 *
 * ```javascript
 * const client = akeneo({
 *   url: AKENEO_API_URL,
 *   username: AKENEO_USERNAME,
 *   password: AKENEO_PASSWORD,
 *   clientId: AKENEO_CLIENT_ID,
 *   secret: AKENEO_SECRET,
 * });
 * ```
 */
export const createClient = (params: ClientParams) => {
  const http = createHttpClient(params);

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
      getAssets: wrap(http, endpoints.assetFamily.getAssets),
      getAsset: wrap(http, endpoints.assetFamily.getAsset),
      getAssetsAll: wrap(http, endpoints.assetFamily.getAssetsAll),
    },
    assetMediaFile: {
      /**
       *
       * @see https://api.akeneo.com/api-reference.html#get_asset_media_files__code
       */
      get: async (code: string) =>
        http.get(`${ASSET_MEDIA_FILES}/${code}`, {
          responseType: 'arraybuffer',
          params: {},
        }),
    },
    referenceEntitiesMediaFile: {
      /**
       * @see https://api.akeneo.com/api-reference.html#get_reference_entity_media_files__code
       */
      get: async (code: string): Promise<any> =>
        http.get(`${REFERENCE_ENTITIES_MEDIA_FILES}/${code}`, {
          responseType: 'arraybuffer',
          params: {},
        }),
    },
    attribute: {
      getOne: wrap(http, endpoints.attribute.getOne),
      get: wrap(http, endpoints.attribute.get),
      getAll: wrap(http, endpoints.attribute.getAll),
      getOptions: wrap(http, endpoints.attribute.getOptions),
      add: async ({ code, attribute }: { code: string; attribute: any }) =>
        http.patch(`${ATTRIBUTES_PATH}/${code}`, attribute),
      addOption: async ({
        attributeCode,
        code,
        option,
      }: {
        attributeCode: string;
        code: string;
        option: any;
      }) =>
        http.patch(
          `${ATTRIBUTES_PATH}/${attributeCode}/options/${code}`,
          option,
        ),
    },
    referenceEntity: {
      get: wrap(http, endpoints.referenceEntity.get),
      getRecords: wrap(http, endpoints.referenceEntity.getRecords),
      /**
       * @see https://api.akeneo.com/api-reference.html#patch_reference_entity__code_
       */ add: async ({ code, body }: { code: string; body: any }) =>
        http.patch(`/api/rest/v1/reference-entities/${code}`, body),
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
        await http.patch(
          `/api/rest/v1/reference-entities/${referenceEntityCode}/attributes/${code}`,
          attribute,
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
          option,
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
          records,
        ),
    },
    family: {
      get: wrap(http, endpoints.family.get),
      getVariants: wrap(http, endpoints.family.getVariants),
    },
  };
};

export type ClientAPI = ReturnType<typeof createClient>;

export * from './types';
export default createClient;
