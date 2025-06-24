import { axiosInstance } from '../config/axiosInstance';

export const orderServices = {
  createOrder: async (payload: {
    items: { productId: string; quantity: number }[];
    totalAmount: number;
  }) => {
    return await axiosInstance.post(`/order`, payload);
  },
  getOrders: async () => {
    return await axiosInstance.get(`/order`);
  },
  updateStatusOrder: async (payload: { orderId: string; status: string }) => {
    return await axiosInstance.put(`/order/update-status`, payload);
  },
};
