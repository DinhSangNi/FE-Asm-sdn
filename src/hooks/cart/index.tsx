import { CartServices } from '@/lib/api/cart';
import { useQuery } from '@tanstack/react-query';

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await CartServices.getItemsInCart();
      return res.data;
    },
    staleTime: 3 * 60 * 1000,
  });
};
