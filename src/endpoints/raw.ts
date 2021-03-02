import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { last } from 'ramda';
import errorHandler from '../error-handler';
import { ListResponse } from '../types';

export default {
  get: function get(
    http: AxiosInstance,
    url: string,
    config: AxiosRequestConfig = { params: {} },
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
  getAll: async function getAll(
    http: AxiosInstance,
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ListResponse & { items: any[] }> {
    const params = config?.params;
    const page = params?.page || 1;
    const { items_count = 0, items } = await this.get(http, url, {
      params: {
        ...params,
        with_count: true,
        limit: 100,
        page,
      },
    });

    if (items_count / 100 > page) {
      const res = {
        items: [
          ...items,
          ...(
            await this.getAll(http, url, {
              params: {
                ...params,
                limit: params?.limit || 100,
                page: page + 1,
              },
            })
          ).items,
        ],
      };
      return res;
    }
    return { items };
  },
  getAllBySearchAfter: async function getAll(
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

    const lastItem = last(items);
    if (_links?.next?.href) {
      const res = {
        items: [
          ...items,
          ...(
            await this.getAllBySearchAfter(http, url, {
              params: {
                ...params,
                limit: params?.limit || 100,
                search_after: lastItem.code,
              },
            })
          ).items,
        ],
      };
      return res;
    }
    return { items };
  },
};
