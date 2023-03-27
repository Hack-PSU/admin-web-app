import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { auth, getEnvironment } from "common/config";
import { getIdToken, getIdTokenResult, User } from "@firebase/auth";
import nookies from "nookies";
import { DateTime } from "luxon";

export type ApiAxiosInstance = AxiosInstance & {
  defaults: {
    headers: {
      authorization?: string;
      exp?: string;
    };
  };
};

type ApiAxiosRequestConfig = AxiosRequestConfig & {
  headers: {
    authorization?: string;
    exp?: string;
  };
};

const config = getEnvironment();

const api = axios.create({
  baseURL: config.baseURL,
}) as ApiAxiosInstance;

// const notificationApi = axios.create({
//   baseURL: config.notificationBaseURL,
// }) as ApiAxiosInstance;
//
// const wsApi = axios.create({
//   baseURL: config.wsBaseURL,
// }) as ApiAxiosInstance;

const shouldRefreshToken = (config: ApiAxiosRequestConfig) => {
  const token = config.headers.authorization?.split("Bearer ")[0] ?? "";
  const expiration = config.headers.exp;
  const isExpired =
    (expiration ? DateTime.fromISO(expiration) : DateTime.now()) <
    DateTime.now();

  return isExpired || !token || !expiration;
};

const refreshToken = async (
  config: ApiAxiosRequestConfig,
  instance: ApiAxiosInstance = api,
  shouldSetCookies?: boolean
) => {
  if (!auth.currentUser) return;
  const tokenResult = await getIdTokenResult(auth.currentUser);

  if (tokenResult) {
    const { token, expirationTime } = tokenResult;
    // required for request retry
    config.headers.authorization = `Bearer ${token}`;

    // set in cookies
    if (shouldSetCookies) {
      nookies.set(undefined, "token", token);
    }

    // for subsequent requests
    instance.defaults.headers.common["authorization"] = `Bearer ${token}`;
    instance.defaults.headers.common["exp"] = expirationTime;
  }
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const request = error.config;
    const isRefreshNeeded =
      shouldRefreshToken(request) &&
      error.response.status === 401 &&
      !request._retried;

    if (isRefreshNeeded) {
      request._retried = true;
      await refreshToken(request, api, true);
      return api(request);
    }
    return Promise.reject(error);
  }
);

export const initApi = async (user: User | null) => {
  if (user) {
    const token = await getIdToken(user);
    api.defaults.headers.common["authorization"] = `Bearer ${token}`;
  }
};

export const resetApi = () => {
  delete api.defaults.headers.common["authorization"];
  delete api.defaults.headers.common["exp"];
};

export { api };
