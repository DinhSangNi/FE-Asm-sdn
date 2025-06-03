import axios, { AxiosInstance } from 'axios';

console.log('Base URL: ', process.env.NEXT_PUBLIC_API_BASE_URL);

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});
