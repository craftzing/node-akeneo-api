import FormData from 'form-data';
import fs from 'fs';
import { AxiosInstance } from 'axios';
import { ListResponse, Product, ProductQueryParameters } from '../types';
import raw from './raw';

/**
 * @see https://api.akeneo.com/api-reference.html#get_products
 */
export const get = (
  http: AxiosInstance,
  { query }: { query?: ProductQueryParameters },
): Promise<ListResponse<Product>> =>
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
): Promise<ListResponse<Product>> => {
  // support legacy pagination_type "page"
  if (query?.pagination_type === 'page') {
    return raw.getAllByPage(http, `/api/rest/v1/products`, {
      params: query,
    });
  }

  return raw.getAllBySearchAfter(http, `/api/rest/v1/products`, {
    params: query,
  });
};

export const update = (
  http: AxiosInstance,
  product: Partial<Product> & Pick<Product, 'identifier'>,
): Promise<Product> => raw.patch(http, `/api/rest/v1/products/${product.identifier}`, product);

export const create = (
  http: AxiosInstance,
  product: Partial<Product> & Pick<Product, 'family' | 'enabled'> & { identifier: string },

): Promise<Product> => raw.post(http, `/api/rest/v1/products`, product);

export const uploadImage = async (
  http: AxiosInstance,
  identifier: string,
  attribute: string,
  filePath: string,
) => {
  const payload = new FormData();
  payload.append('product', JSON.stringify({ identifier, attribute, scope: null, locale: null }));

  // filePath can be without path, so we need to get the last part of the path
  const fileParts = filePath.split("/");
  const fileName = fileParts[fileParts.length - 1] || filePath;
 
  payload.append("file", fs.readFileSync(filePath), fileName);
  const config = {
    headers: {
      ...payload.getHeaders()
    }
  }
  await raw.post(http, `/api/rest/v1/media-files`, payload, config);
}