import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { auth, getEnvironment } from "common/config";
import { getApp } from "@firebase/app";
import { User, getAuth, getIdToken, getIdTokenResult } from "@firebase/auth";
import moment from "moment";
import { DateTime } from "luxon";

type ApiAxiosInstance = AxiosInstance & {
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

const shouldRefreshToken = (config: ApiAxiosRequestConfig) => {
  const token = config.headers.idtoken;
  const expiration = config.headers.exp;
  const isExpired = moment(expiration).isBefore(moment.now());

  return isExpired || !token || !expiration;
};

const refreshToken = async (config: ApiAxiosRequestConfig) => {
  if (!auth.currentUser) return;
  const tokenResult = await getIdTokenResult(auth.currentUser);

  if (tokenResult) {
    const { token, expirationTime } = tokenResult;
    // required for request retry
    config.headers.idtoken = token;

    // for subsequent requests
    api.defaults.headers.common["idtoken"] = token;
    api.defaults.headers.common["exp"] = expirationTime;
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
      !request._canRetry;

    if (isRefreshNeeded) {
      request._canRetry = true;
      await refreshToken(request);
      return api(request);
    }
    return Promise.reject(error);
  }
);

export const initApi = async (user: User | null) => {
  if (user) {
    api.defaults.headers.common["idtoken"] = await getIdToken(user);
  }
};

export const resetApi = () => {
  delete api.defaults.headers.common["idtoken"];
  delete api.defaults.headers.common["exp"];
};

// api.interceptors.request.use(async (request) => {
//   if (request.headers && request.headers.idtoken) {
//     return request;
//   }
//
//   const user = getAuth(getApp()).currentUser;
//
//   if (user) {
//     const token = await user.getIdToken(true);
//     if (request.headers) {
//       request.headers["idtoken"] = token;
//     }
//   } else {
//     throw Error("Unauthorized");
//   }
//
//   return request;
// });

export default api;
