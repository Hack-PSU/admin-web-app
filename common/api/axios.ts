import axios from "axios";
import { getAuth } from "firebase/auth";
import { getEnvironment } from "common/config";
import { getApp } from "@firebase/app";

const config = getEnvironment();

const api = axios.create({
  baseURL: config.baseURL,
});

api.interceptors.request.use(async (request) => {
  if (request.headers && request.headers.idtoken) {
    return request;
  }

  const user = getAuth(getApp()).currentUser;

  if (user) {
    const token = await user.getIdToken(true);
    if (request.headers) {
      request.headers["idtoken"] = token;
    }
  } else {
    throw Error("Unauthorized");
  }

  return request;
});

export default api;
