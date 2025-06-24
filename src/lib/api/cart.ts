import { axiosInstance } from '../config/axiosInstance';

export const CartServices = {
  getItemsInCart: async () => {
    return await axiosInstance.get('/cart');
  },
  addToCart: async (payload: { productId: string; quantity: number }) => {
    return await axiosInstance.post('/cart/add-to-cart', payload);
  },
  removeFromCart: async (payload: { productId: string }) => {
    return await axiosInstance.post('/cart/remove-from-cart', payload);
  },
  updateCart: async (payload: { productId: string; quantity: number }) => {
    return await axiosInstance.put('/cart/update-cart', payload);
  },
  deleteCart: async (payload: { productIds: string[] }) => {
    return await axiosInstance.delete(`/cart/delete-cart`, {
      data: payload,
    });
  },
  clearCart: async () => {
    return await axiosInstance.delete(`/cart/clear-cart`);
  },
};
