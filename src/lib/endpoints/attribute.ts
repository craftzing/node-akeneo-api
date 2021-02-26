import { AxiosInstance } from "axios";

import {
  ListResponse,
  Attribute,
  AttributeOption,
  AttributeQueryParameters,
  AttributeOptionQueryParameters,
} from "../types";
import raw from "./raw";

/**
 * @see https://api.akeneo.com/api-reference.html#get_attributes
 */
export const get = (
  http: AxiosInstance,
  params: { query?: AttributeQueryParameters }
): Promise<ListResponse & { items: Attribute[] }> => {
  return raw.get(http, `/api/rest/v1/attributes`, {
    params: {
      ...params.query,
    },
  });
};

/**
 * @see https://api.akeneo.com/api-reference.html#get_attributes__code_
 */
export const getOne = (
  http: AxiosInstance,
  params: {
    code: string;
  }
): Promise<Attribute> => {
  return raw.getOne(http, `/api/rest/v1/attributes/${params.code}`, {});
};

export const getAll = (
  http: AxiosInstance,
  params: { query?: AttributeQueryParameters }
): Promise<ListResponse & { items: Attribute[] }> => {
  return raw.getAll(http, `/api/rest/v1/attributes`, {
    params: {
      ...params.query,
    },
  });
};

/**
 * @see https://api.akeneo.com/api-reference.html#get_attributes__attribute_code__options
 */
export const getOptions = (
  http: AxiosInstance,
  params: { attributeCode: string; query?: AttributeOptionQueryParameters }
): Promise<ListResponse & { items: AttributeOption[] }> => {
  return raw.get(
    http,
    `/api/rest/v1/attributes/${params.attributeCode}/options`,
    {
      params: {
        ...params.query,
      },
    }
  );
};
