import axios, { AxiosInstance } from 'axios';

console.log('Base URL: ', process.env.BASE_URL);

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});
