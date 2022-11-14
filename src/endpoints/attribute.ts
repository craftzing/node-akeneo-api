import { AxiosInstance } from 'axios';

import {
  ListResponse,
  Attribute,
  AttributeOption,
  AttributeQueryParameters,
  AttributeOptionQueryParameters,
} from '../types';
import raw from './raw';

/**
 * @see https://api.akeneo.com/api-reference.html#get_attributes
 */
export const get = (
  http: AxiosInstance,
  params: { query?: AttributeQueryParameters },
): Promise<ListResponse & { items: Attribute[] }> =>
  raw.get(http, `/api/rest/v1/attributes`, {
    params: {
      ...params.query,
    },
  });

/**
 * @see https://api.akeneo.com/api-reference.html#get_attributes__code_
 */
export const getOne = (
  http: AxiosInstance,
  {
    code,
  }: {
    code: string;
  },
): Promise<Attribute> => raw.getOne(http, `/api/rest/v1/attributes/${code}`);

export const getAll = (
  http: AxiosInstance,
  { query = {} }: { query?: AttributeQueryParameters },
): Promise<ListResponse & { items: Attribute[] }> =>
  raw.getAllByPage(http, `/api/rest/v1/attributes`, {
    params: query,
  });

/**
 * @see https://api.akeneo.com/api-reference.html#get_attributes__attribute_code__options
 */
export const getOptions = (
  http: AxiosInstance,
  {
    attributeCode,
    query,
  }: { attributeCode: string; query?: AttributeOptionQueryParameters },
): Promise<ListResponse & { items: AttributeOption[] }> =>
  raw.getAllByPage(http, `/api/rest/v1/attributes/${attributeCode}/options`, {
    params: query,
  });
