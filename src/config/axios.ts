import axios from "axios";

export const axiosI = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

let token = localStorage.getItem("token");

export const axiosT = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    authorization: `Bearer ${token}`,
  },
});
