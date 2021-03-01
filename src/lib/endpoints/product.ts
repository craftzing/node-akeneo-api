import { AxiosInstance } from 'axios';
import { ListResponse, Product, ProductQueryParameters } from '../types';
import raw from './raw';

/**
 * @see https://api.akeneo.com/api-reference.html#get_products
 */
export const get = (
  http: AxiosInstance,
  params: { query?: ProductQueryParameters },
): Promise<ListResponse & { items: Product[] }> => {
  return raw.get(http, `/api/rest/v1/products`, {
    params: {
      ...params.query,
    },
  });
};

/**
 * @see https://api.akeneo.com/api-reference.html#get_products__code_
 */
export const getOne = (
  http: AxiosInstance,
  params: {
    code: string;
    query?: {
      with_attribute_options?: boolean;
      with_quality_scores?: boolean;
    };
  },
): Promise<Product> => {
  return raw.getOne(http, `/api/rest/v1/products/${params.code}`, {
    params: {
      ...params.query,
    },
  });
};

export const getAll = (
  http: AxiosInstance,
  params: { query?: ProductQueryParameters },
): Promise<ListResponse & { items: Product[] }> => {
  return raw.getAll(http, `/api/rest/v1/products`, {
    params: {
      ...params.query,
    },
  });
};
