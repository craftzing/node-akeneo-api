import { AxiosInstance } from 'axios';
import { ListResponse, Category, CategoryQueryParameters } from '../types';
import raw from './raw';

/**
 * @see https://api.akeneo.com/api-reference.html#Category
 */
export const get = (
  http: AxiosInstance,
  params: { query?: CategoryQueryParameters },
): Promise<ListResponse & { items: Category[] }> =>
  raw.get(http, `/api/rest/v1/categories`, {
    params: {
      ...params.query,
    },
  });

/**
 * @see https://api.akeneo.com/api-reference.html#get_categories__code_
 */
export const getOne = (
  http: AxiosInstance,
  {
    code,
    ...params
  }: {
    code: string;
    query?: {
      with_attribute_options?: boolean;
      with_quality_scores?: boolean;
    };
  },
): Promise<Category> =>
  raw.getOne(http, `/api/rest/v1/categories/${code}`, {
    params,
  });

export const getAll = (
  http: AxiosInstance,
  params: { query?: CategoryQueryParameters },
): Promise<ListResponse & { items: Category[] }> =>
  raw.getAllByPage(http, `/api/rest/v1/categories`, {
    params,
  });
