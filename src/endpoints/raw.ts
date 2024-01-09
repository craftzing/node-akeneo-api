/* eslint-disable no-underscore-dangle */
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as querystring from 'querystring';
import errorHandler from '../error-handler';
import { ListResponse } from '../types';

export default {
  get: function get(
    http: AxiosInstance,
    url: string,
    config: AxiosRequestConfig,
  ): Promise<
    ListResponse<any> & {
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
  ): Promise<ListResponse<any>> {
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
  ): Promise<ListResponse<any>> {
    const params = config?.params;
    const { items, _links } = await this.get(http, url, {
      params: {
        ...params,
        ...(params?.search_after ? { search_after: params.search_after } : {}),
        pagination_type: 'search_after',
        limit: 100,
      },
    });

    const nextUrl = _links?.next?.href;
    if (!nextUrl) return { items };

    const search_after =
      querystring.parse(nextUrl.split('?').at(1))?.search_after || '';

    return {
      items: [
        ...items,
        ...(
          await this.getAllBySearchAfter(http, url, {
            params: {
              ...params,
              limit: params?.limit || 100,
              pagination_type: 'search_after',
              search_after,
            },
          })
        ).items,
      ],
    };
  },
};
