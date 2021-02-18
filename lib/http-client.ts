import qs from "qs";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { isNode, getNodeVersion } from "./utils";
import { ClientParams } from "./types";

/**
 * Create pre configured axios instance
 * @private
 * @param {ClientParams} options - Initialization parameters for the HTTP client
 * @return {AxiosInstance} Initialized axios instance
 */
const createHttpClient = (options: ClientParams): AxiosInstance => {
  let accessToken: string = "invalid";

  const defaultConfig = {
    insecure: false,
    retryOnError: true,
    logHandler: (level: string, data: any): void => {
      if (level === "error" && data) {
        const title = [data.name, data.message].filter((a) => a).join(" - ");
        console.error(`[error] ${title}`);
        console.error(data);
        return;
      }
      console.log(`[${level}] ${data}`);
    },
    headers: {} as Record<string, unknown>,
    httpAgent: false,
    httpsAgent: false,
    timeout: 30000,
    proxy: false as const,
    basePath: "",
    adapter: undefined,
    maxContentLength: 1073741824, // 1GB
  };

  const { baseURL } = options;
  const axiosConfig = {
    ...defaultConfig,
    ...(options.axiosOptions || {}),
    baseURL,
    paramsSerializer: qs.stringify,
  };

  // Set these headers only for node because browsers don't like it when you
  // override user-agent or accept-encoding.
  if (isNode()) {
    axiosConfig.headers["user-agent"] = `node.js/${getNodeVersion()}`;
    axiosConfig.headers["Accept-Encoding"] = "gzip";
  }

  const instance = axios.create(axiosConfig) as AxiosInstance;

  const TOKEN_PATH = "/api/oauth/v1/token";

  const base64EncodedBuffer = Buffer.from(
    `${options.clientId}:${options.secret}`
  );
  const base64Encoded = base64EncodedBuffer.toString("base64");

  const getAccessToken = async () => {
    if (!accessToken) {
      const tokenResult = await axios.post(
        `${baseURL}${TOKEN_PATH}`,
        {
          grant_type: "password",
          username: options.username,
          password: options.password,
        },
        {
          headers: {
            Authorization: `Basic ${base64Encoded}`,
          },
        }
      );

      accessToken = tokenResult.data.access_token;
    }
    return accessToken;
  };

  instance.interceptors.request.use(function (config) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    return config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (
        error.response &&
        (error.response.status === 403 || error.response.status === 401) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        accessToken = "";
        originalRequest.headers.Authorization =
          "Bearer " + (await getAccessToken());
        return instance(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createHttpClient;
