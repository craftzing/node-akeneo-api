import { AxiosInstance } from "axios";
import {
  ListResponse,
  Family,
  Variant,
  FamilyQueryParameters,
  FamilyVariantQueryParameters,
} from "../types";
import raw from "./raw";

/**
 * @see https://api.akeneo.com/api-reference.html#get_families
 */
export const get = (
  http: AxiosInstance,
  params: { query?: FamilyQueryParameters }
): Promise<ListResponse & { items: Family[] }> => {
  return raw.get(http, `/api/rest/v1/families`, {
    params: {
      ...params.query,
    },
  });
};
/**
 * @see https://api.akeneo.com/api-reference.html#Familyvariant
 */
export const getVariants = (
  http: AxiosInstance,
  params: {
    familyCode: string;
    query?: FamilyVariantQueryParameters;
  }
): Promise<ListResponse & { items: Variant[] }> => {
  return raw.get(http, `/api/rest/v1/families/${params.familyCode}/variants`, {
    params: {
      ...params.query,
    },
  });
};
