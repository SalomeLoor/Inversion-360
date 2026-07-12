import axios from 'axios';
import { getCookie } from '../utils/cookies';

const url = "http://localhost:3000/api";

export const connection = axios.create({
  baseURL: url,
  withCredentials: true, 
});

connection.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);