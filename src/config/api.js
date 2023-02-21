import axios from "axios";

export const API = axios.create({
  baseURL: 'https://tht-api.nutech-integrasi.app',
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};