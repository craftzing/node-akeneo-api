import { AxiosInstance } from "axios";
import { ListResponse, Asset, AssetQueryParameters } from "../types";
import raw from "./raw";

/**
 * @see https://api.akeneo.com/api-reference.html#get_assets
 */
export const get = (
  http: AxiosInstance,
  params: { assetFamilyCode: string; query?: AssetQueryParameters }
): Promise<ListResponse & { items: Asset[] }> => {
  return raw.get(
    http,
    `/api/rest/v1/asset-families/${params.assetFamilyCode}/assets`,
    {
      params: {
        ...params.query,
      },
    }
  );
};

/**
 * @see https://api.akeneo.com/api-reference.html#get_assets__code_
 */
export const getOne = (
  http: AxiosInstance,
  params: {
    assetFamilyCode: string;
    code: string;
  }
): Promise<Asset> => {
  return raw.getOne(
    http,
    `/api/rest/v1/asset-families/${params.assetFamilyCode}/assets/${params.code}`,
    {}
  );
};

export const getAll = (
  http: AxiosInstance,
  params: { assetFamilyCode: string; query?: AssetQueryParameters }
): Promise<ListResponse & { items: Asset[] }> => {
  return raw.getAllBySearchAfter(
    http,
    `/api/rest/v1/asset-families/${params.assetFamilyCode}/assets`,
    {
      params: {
        ...params.query,
      },
    }
  );
};
