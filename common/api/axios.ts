import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { auth, getEnvironment } from "common/config";
import { User, getIdToken, getIdTokenResult } from "@firebase/auth";
import moment from "moment";
import nookies from "nookies";

export type ApiAxiosInstance = AxiosInstance & {
  defaults: {
    headers: {
      idtoken?: string;
      exp?: string;
    };
  };
};

type ApiAxiosRequestConfig = AxiosRequestConfig & {
  headers: {
    exp?: string;
    idtoken?: string;
  };
};

const config = getEnvironment();

const api = axios.create({
  baseURL: config.baseURL,
}) as ApiAxiosInstance;

const notificationApi = axios.create({
  baseURL: config.notificationBaseURL,
}) as ApiAxiosInstance;

const wsApi = axios.create({
  baseURL: config.wsBaseURL,
}) as ApiAxiosInstance;

const shouldRefreshToken = (config: ApiAxiosRequestConfig) => {
  const token = config.headers.idtoken;
  const expiration = config.headers.exp;
  const isExpired = moment(expiration).isBefore(moment.now());

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
    config.headers.idtoken = token;

    // set in cookies
    if (shouldSetCookies) {
      nookies.set(undefined, "idtoken", token);
    }

    // for subsequent requests
    instance.defaults.headers.common["idtoken"] = token;
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

notificationApi.interceptors.response.use(
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
      await refreshToken(request, notificationApi);
      return notificationApi(request);
    }
    return Promise.reject(error);
  }
);

wsApi.interceptors.response.use(
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
      await refreshToken(request, wsApi);
      return wsApi(request);
    }
    return Promise.reject(error);
  }
);

const initApi = async (user: User | null, instance: ApiAxiosInstance = api) => {
  if (user) {
    instance.defaults.headers.common["idtoken"] = await getIdToken(user);
  }
};

const resetApi = (instance: ApiAxiosInstance = api) => {
  delete instance.defaults.headers.common["idtoken"];
  delete instance.defaults.headers.common["exp"];
};

export const initApiV2 = (user: User | null) => initApi(user, api);
export const resetApiV2 = () => resetApi(api);

export const initNotificationApi = (user: User | null) =>
  initApi(user, notificationApi);
export const resetNotificationApi = () => resetApi(notificationApi);

export const initWsApi = (user: User | null) => initApi(user, wsApi);
export const resetWsApi = () => resetApi(wsApi);

export { api, notificationApi, wsApi };
