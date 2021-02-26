import { AxiosInstance } from "axios";
import {
  ListResponse,
  AssetFamily,
  AssetFamilyQueryParameters,
} from "../types";
import raw from "./raw";

/**
 * @see https://api.akeneo.com/api-reference.html#Assetfamily
 */
export const get = (
  http: AxiosInstance,
  params: { query?: AssetFamilyQueryParameters }
): Promise<ListResponse & { items: AssetFamily[] }> => {
  return raw.get(http, `/api/rest/v1/asset-families`, {
    params: {
      ...params.query,
    },
  });
};

/**
 * @see https://api.akeneo.com/api-reference.html#get_asset_family__code_
 */
export const getOne = (
  http: AxiosInstance,
  params: {
    code: string;
    query?: {
      with_attribute_options?: boolean;
      with_quality_scores?: boolean;
    };
  }
): Promise<AssetFamily> => {
  return raw.getOne(http, `/api/rest/v1/asset-families/${params.code}`, {
    params: {
      ...params.query,
    },
  });
};

export const getAll = (
  http: AxiosInstance,
  params: { query?: AssetFamilyQueryParameters }
): Promise<ListResponse & { items: AssetFamily[] }> => {
  return raw.getAll(http, `/api/rest/v1/asset-families`, {
    params: {
      ...params.query,
    },
  });
};
