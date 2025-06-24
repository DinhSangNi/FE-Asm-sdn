import { axiosInstance } from '../config/axiosInstance';

export const AuthService = {
  register: async (name: string, email: string, password: string) => {
    return await axiosInstance.post(`/auth/register`, {
      name,
      email,
      password,
    });
  },
  login: async (email: string, password: string) => {
    return await axiosInstance.post(`auth/login`, {
      email,
      password,
    });
  },
};
