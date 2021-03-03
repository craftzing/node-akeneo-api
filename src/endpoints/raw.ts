/* eslint-disable no-underscore-dangle */
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { last } from 'ramda';
import errorHandler from '../error-handler';
import { ListResponse } from '../types';

export default {
  get: function get(
    http: AxiosInstance,
    url: string,
    config: AxiosRequestConfig,
  ): Promise<
    ListResponse & {
      items: any[];
      _links: any;
    }
  > {
    return http
      .get(url, {
        ...config,
      })
      .then((response) => {
        const { data } = response;
        return {
          ...(data.current_page ? { current_page: data.current_page } : {}),
          ...(data.items_count ? { items_count: data.items_count } : {}),
          items: data._embedded.items,
          _links: data._links,
        };
      }, errorHandler);
  },
  getOne: function getOne(
    http: AxiosInstance,
    url: string,
    config?: AxiosRequestConfig,
  ) {
    return http
      .get(url, {
        ...config,
      })
      .then((response) => {
        const { data } = response;
        return data;
      }, errorHandler);
  },
  getAllByPage: async function getAllByPage(
    http: AxiosInstance,
    url: string,
    { params = {} }: AxiosRequestConfig,
  ): Promise<ListResponse & { items: any[] }> {
    const page = params?.page || 1;
    const { items_count = 0, items } = await this.get(http, url, {
      params: {
        ...params,
        with_count: true,
        limit: 100,
        page,
      },
    });

    return items_count / 100 > page
      ? {
          items: [
            ...items,
            ...(
              await this.getAllByPage(http, url, {
                params: {
                  ...params,
                  limit: 100,
                  page: page + 1,
                },
              })
            ).items,
          ],
        }
      : { items };
  },
  getAllBySearchAfter: async function getAllBySearchAfter(
    http: AxiosInstance,
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ListResponse & { items: any[] }> {
    const params = config?.params;
    const search_after = params?.search_after || '';
    const { items, _links } = await this.get(http, url, {
      params: {
        ...(search_after ? { search_after } : {}),
        limit: 100,
      },
    });

    return _links?.next?.href
      ? {
          items: [
            ...items,
            ...(
              await this.getAllBySearchAfter(http, url, {
                params: {
                  ...params,
                  limit: params?.limit || 100,
                  search_after: last(items).code,
                },
              })
            ).items,
          ],
        }
      : { items };
  },
};
