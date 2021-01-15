import qs from "qs";
import axios from "axios";
import { isNode, getNodeVersion } from "./utils.js";

const createHttpClient = (options) => {
  let accessToken;
  const defaultConfig = {
    insecure: false,
    retryOnError: true,
    logHandler: (level, data) => {
      if (level === "error" && data) {
        const title = [data.name, data.message].filter((a) => a).join(" - ");
        console.error(`[error] ${title}`);
        console.error(data);
        return;
      }
      console.log(`[${level}] ${data}`);
    },
    // Passed to axios
    headers: {},
    httpAgent: false,
    httpsAgent: false,
    timeout: 30000,
    proxy: false,
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
    // Contentful
    logHandler: config.logHandler,
    responseLogger: config.responseLogger,
    requestLogger: config.requestLogger,
    retryOnError: config.retryOnError,
  };

  const instance = axios.create(axiosOptions);

  const TOKEN_PATH = "/api/oauth/v1/token";

  const base64EncodedBuffer = Buffer.from(
    `${config.clientId}:${config.secret}`
  );
  const base64Encoded = base64EncodedBuffer.toString("base64");

  const getAccessToken = async () => {
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
