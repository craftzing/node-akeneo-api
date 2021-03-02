import { AxiosInstance } from 'axios';
import { ListResponse, Product, ProductQueryParameters } from '../types';
import raw from './raw';

/**
 * @see https://api.akeneo.com/api-reference.html#get_products
 */
export const get = (
  http: AxiosInstance,
  { query }: { query?: ProductQueryParameters },
): Promise<ListResponse & { items: Product[] }> =>
  raw.get(http, `/api/rest/v1/products`, {
    params: query,
  });

/**
 * @see https://api.akeneo.com/api-reference.html#get_products__code_
 */
export const getOne = (
  http: AxiosInstance,
  {
    code,
    query,
  }: {
    code: string;
    query?: {
      with_attribute_options?: boolean;
      with_quality_scores?: boolean;
    };
  },
): Promise<Product> =>
  raw.getOne(http, `/api/rest/v1/products/${code}`, {
    params: query,
  });

export const getAll = (
  http: AxiosInstance,
  { query = {} }: { query?: ProductQueryParameters },
): Promise<ListResponse & { items: Product[] }> =>
  raw.getAll(http, `/api/rest/v1/products`, {
    params: query,
  });
