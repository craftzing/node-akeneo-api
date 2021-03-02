import { AxiosInstance } from 'axios';
import {
  ListResponse,
  ProductModel,
  ProductModelQueryParameters,
} from '../types';
import raw from './raw';

/**
 * @see https://api.akeneo.com/api-reference.html#get_product_models
 */
export const get = (
  http: AxiosInstance,
  { query }: { query?: ProductModelQueryParameters },
): Promise<ListResponse & { items: ProductModel[] }> => {
  return raw.get(http, `/api/rest/v1/product-models`, {
    params: query,
  });
};

/**
 * @see https://api.akeneo.com/api-reference.html#get_product_models__code_
 */
export const getOne = (
  http: AxiosInstance,
  params: {
    code: string;
  },
): Promise<ProductModel> => {
  return raw.getOne(http, `/api/rest/v1/product-models/${params.code}`, {});
};

export const getAll = (
  http: AxiosInstance,
  { query }: { query?: ProductModelQueryParameters },
): Promise<ListResponse & { items: ProductModel[] }> => {
  return raw.getAll(http, `/api/rest/v1/product-models`, {
    params: query,
  });
};
