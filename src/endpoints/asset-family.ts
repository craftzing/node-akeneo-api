import { AxiosInstance } from 'axios';
import {
  ListResponse,
  Asset,
  AssetQueryParameters,
  AssetFamily,
  AssetFamilyQueryParameters,
} from '../types';
import raw from './raw';

/**
 * @see https://api.akeneo.com/api-reference.html#Assetfamily
 */
export const get = (
  http: AxiosInstance,
  params: { query?: AssetFamilyQueryParameters },
): Promise<ListResponse & { items: AssetFamily[] }> =>
  raw.get(http, `/api/rest/v1/asset-families`, {
    params: {
      ...params.query,
    },
  });

/**
 * @see https://api.akeneo.com/api-reference.html#get_asset_family__code_
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
): Promise<AssetFamily> =>
  raw.getOne(http, `/api/rest/v1/asset-families/${code}`, {
    params: query,
  });

export const getAll = (
  http: AxiosInstance,
  { query }: { query?: AssetFamilyQueryParameters },
): Promise<ListResponse & { items: AssetFamily[] }> =>
  raw.getAll(http, `/api/rest/v1/asset-families`, {
    params: query,
  });
/**
 * @see https://api.akeneo.com/api-reference.html#get_assets
 */
export const getAssets = (
  http: AxiosInstance,
  {
    assetFamilyCode,
    query,
  }: { assetFamilyCode: string; query?: AssetQueryParameters },
): Promise<ListResponse & { items: Asset[] }> =>
  raw.get(http, `/api/rest/v1/asset-families/${assetFamilyCode}/assets`, {
    params: query,
  });
/**
 * @see https://api.akeneo.com/api-reference.html#get_assets__code_
 */
export const getAsset = (
  http: AxiosInstance,
  {
    assetFamilyCode,
    code,
  }: {
    assetFamilyCode: string;
    code: string;
  },
): Promise<Asset> =>
  raw.getOne(
    http,
    `/api/rest/v1/asset-families/${assetFamilyCode}/assets/${code}`,
    {},
  );

export const getAssetsAll = (
  http: AxiosInstance,
  {
    assetFamilyCode,
    query,
  }: { assetFamilyCode: string; query?: AssetQueryParameters },
): Promise<ListResponse & { items: Asset[] }> =>
  raw.getAllBySearchAfter(
    http,
    `/api/rest/v1/asset-families/${assetFamilyCode}/assets`,
    {
      params: query,
    },
  );
