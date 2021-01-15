import { path } from "ramda";

export default function errorHandler(errorResponse) {
  const { config, response } = errorResponse;
  let errorName;

  // Obscure the Management token
  if (config.headers && config.headers["Authorization"]) {
    const token = `...${config.headers["Authorization"].substr(-5)}`;
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  const data = response?.data;

  const errorData = {
    status: response?.status,
    statusText: response?.statusText,
    message: "",
    details: {},
  };

  if (data) {
    if ("requestId" in data) {
      errorData.requestId = data.requestId || "UNKNOWN";
    }
    if ("message" in data) {
      errorData.message = data.message || "";
    }
    if ("details" in data) {
      errorData.details = data.details || {};
    }
  }

  const error = new Error();
  error.name =
    errorName && errorName !== "Unknown"
      ? errorName
      : `${response?.status} ${response?.statusText}`;

  try {
    error.message = JSON.stringify(errorData, null, "  ");
  } catch {
    error.message = path(errorData, ["message"], "");
  }
  throw error;
}
