import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { QA_AUTO_API_URL } from "../constants/api.js";

export function createApiClient(baseURL = QA_AUTO_API_URL) {
  return axios.create({
    baseURL,
    validateStatus: () => true,
  });
}

export function createApiClientWithCookies(baseURL = QA_AUTO_API_URL) {
  const jar = new CookieJar();
  const client = axios.create({
    baseURL,
    validateStatus: () => true,
    jar,
    withCredentials: true,
  });

  return wrapper(client);
}
