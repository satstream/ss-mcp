// Proxy utility for Satstream SaaS API GET requests
// This will be implemented to forward requests to the SaaS API with the API key

import axios from "axios";

const BASE_URL = "https://api.satstream.io/api/v1";

export async function proxyApiRequest({
  method,
  path,
  pathParams = {},
  queryParams = {},
  apiKey,
}: {
  method: "GET";
  path: string;
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number | undefined>;
  apiKey: string;
}) {
  // Replace path params in the path string
  let resolvedPath = path;
  for (const [key, value] of Object.entries(pathParams)) {
    resolvedPath = resolvedPath.replace(`{${key}}`, encodeURIComponent(String(value)));
  }

  const url = `${BASE_URL}${resolvedPath}`;

  try {
    const response = await axios.get(url, {
      params: queryParams,
      headers: {
        "X-API-KEY": apiKey,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        error: true,
        status: error.response.status,
        data: error.response.data,
      };
    }
    return {
      error: true,
      message: error.message,
    };
  }
} 