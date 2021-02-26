import { AxiosInstance } from "axios";
import {
  ListResponse,
  ProductModel,
  ProductModelQueryParameters,
} from "../types";
import raw from "./raw";

/**
 * @see https://api.akeneo.com/api-reference.html#get_product_models
 */
export const get = (
  http: AxiosInstance,
  params: { query?: ProductModelQueryParameters }
): Promise<ListResponse & { items: ProductModel[] }> => {
  return raw.get(http, `/api/rest/v1/product-models`, {
    params: {
      ...params.query,
    },
  });
};

/**
 * @see https://api.akeneo.com/api-reference.html#get_product_models__code_
 */
export const getOne = (
  http: AxiosInstance,
  params: {
    identifier: string;
  }
): Promise<ProductModel> => {
  return raw.getOne(
    http,
    `/api/rest/v1/product-models/${params.identifier}`,
    {}
  );
};

export const getAll = (
  http: AxiosInstance,
  params: { query?: ProductModelQueryParameters }
): Promise<ListResponse & { items: ProductModel[] }> => {
  return raw.getAll(http, `/api/rest/v1/product-models`, {
    params: {
      ...params.query,
    },
  });
};
