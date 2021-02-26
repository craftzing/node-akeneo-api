import { AxiosInstance } from "axios";
import {
  ListResponse,
  Entity,
  EntityRecord,
  ReferenceEntityQueryParameters,
  ReferenceEntityRecordQueryParameters,
} from "../types";
import raw from "./raw";

/**
 * @see https://api.akeneo.com/api-reference.html#get_reference_entities
 */
export const get = (
  http: AxiosInstance,
  params: { query?: ReferenceEntityQueryParameters }
): Promise<ListResponse & { items: Entity[] }> => {
  return raw.get(http, `/api/rest/v1/reference-entities`, {
    params: {
      ...params.query,
    },
  });
};
/**
 * @see https://api.akeneo.com/api-reference.html#get_reference_entity_records
 */
export const getRecords = (
  http: AxiosInstance,
  params: {
    referenceEntityCode: string;
    query?: ReferenceEntityRecordQueryParameters;
  }
): Promise<ListResponse & { items: EntityRecord[] }> => {
  return raw.get(
    http,
    `/api/rest/v1/reference-entities/${params.referenceEntityCode}/records`,
    {
      params: {
        ...params.query,
      },
    }
  );
};
