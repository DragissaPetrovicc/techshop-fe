import axios from "axios";

export const axiosI = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const axiosT = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const setupInterceptors = (token: string | null) => {
  axiosT.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
