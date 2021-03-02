import { path } from 'ramda';
import { AxiosError } from 'axios';

export default function errorHandler(errorResponse: AxiosError): never {
  const { config, response } = errorResponse;
  let errorName;

  // Obscure the Authorization token
  if (config && config.headers && config.headers.Authorization) {
    const token = `...${config.headers.Authorization.substr(-5)}`;
    config.headers.Authorization = `Bearer ${token}`;
  }

  const data = response?.data;

  const errorData: {
    status?: number;
    statusText?: string;
    requestId?: string;
    message: string;
    details: Record<string, any>;
    request?: Record<string, any>;
  } = {
    status: response?.status,
    statusText: response?.statusText,
    message: data && 'message' in data ? data.message : '',
    details: data && 'details' in data ? data.details : '',
  };

  if (config) {
    errorData.request = {
      url: config.url,
      headers: config.headers,
      method: config.method,
      payloadData: config.data,
    };
  }

  const error = new Error();
  error.name =
    errorName && errorName !== 'Unknown'
      ? errorName
      : `${response?.status} ${response?.statusText}`;

  try {
    error.message = JSON.stringify(errorData, null, '  ');
  } catch {
    error.message = path(['message'], errorData) || '';
  }
  throw error;
}
