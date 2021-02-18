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
  let expiresAt: number;
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
    // Passed to axios
    headers: {} as Record<string, unknown>,
    httpAgent: false,
    httpsAgent: false,
    timeout: 30000,
    proxy: false as const,
    basePath: "",
    adapter: undefined,
    maxContentLength: 1073741824, // 1GB
  };
  const config = {
    ...defaultConfig,
    ...options,
  };

  const { baseURL } = options;

  // Set these headers only for node because browsers don't like it when you
  // override user-agent or accept-encoding.
  if (isNode()) {
    config.headers["user-agent"] = `node.js/${getNodeVersion()}`;
    config.headers["Accept-Encoding"] = "gzip";
  }

  const axiosOptions = {
    // Axios
    baseURL,
    headers: config.headers,
    httpAgent: config.httpAgent,
    httpsAgent: config.httpsAgent,
    paramsSerializer: qs.stringify,
    proxy: config.proxy,
    timeout: config.timeout,
    adapter: config.adapter,
    maxContentLength: config.maxContentLength,
    logHandler: config.logHandler,
    // responseLogger: config.responseLogger,
    // requestLogger: config.requestLogger,
    retryOnError: config.retryOnError,
  };

  const instance = axios.create(axiosOptions) as AxiosInstance;

  const TOKEN_PATH = "/api/oauth/v1/token";

  const base64EncodedBuffer = Buffer.from(
    `${config.clientId}:${config.secret}`
  );
  const base64Encoded = base64EncodedBuffer.toString("base64");

  const getAccessToken = async () => {
    // if no accessToken or accessToken will soon expire (in less than 60 seconds)
    if (!accessToken) {
      const tokenResult = await axios.post(
        `${baseURL}${TOKEN_PATH}`,
        {
          grant_type: "password",
          username: config.username,
          password: config.password,
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

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (
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

  instance.interceptors.request.use(function (config) {
    return getAccessToken().then((accessToken) => {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      return config;
    });
  });

  return instance;
};

export default createHttpClient;
