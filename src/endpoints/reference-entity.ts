import { AxiosInstance } from 'axios';
import {
  ListResponse,
  Entity,
  EntityRecord,
  ReferenceEntityQueryParameters,
  ReferenceEntityRecordQueryParameters,
} from '../types';
import raw from './raw';

/**
 * @see https://api.akeneo.com/api-reference.html#get_reference_entities
 */
export const get = (
  http: AxiosInstance,
  { query }: { query?: ReferenceEntityQueryParameters },
): Promise<ListResponse<Entity>> =>
  raw.get(http, `/api/rest/v1/reference-entities`, {
    params: query,
  });
/**
 * @see https://api.akeneo.com/api-reference.html#get_reference_entity_records
 */
export const getRecords = (
  http: AxiosInstance,
  {
    referenceEntityCode,
    query,
  }: {
    referenceEntityCode: string;
    query?: ReferenceEntityRecordQueryParameters;
  },
): Promise<ListResponse<EntityRecord>> =>
  raw.get(
    http,
    `/api/rest/v1/reference-entities/${referenceEntityCode}/records`,
    {
      params: query,
    },
  );
