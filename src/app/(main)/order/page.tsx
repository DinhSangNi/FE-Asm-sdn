'use client';
import OrderItem from '@/components/OrderItem';
import { orderServices } from '@/lib/api/order';
import { Order as OrderType } from '@/types/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import toast from 'react-hot-toast';

const Order = () => {
  const queryClient = useQueryClient();
  const { data: orders, isSuccess } = useQuery({
    queryKey: ['order'],
    queryFn: async () => {
      return await orderServices.getOrders();
    },
    staleTime: 3 * 60 * 1000,
  });

  const updateStatusOrderMutation = useMutation({
    mutationFn: async (payload: { orderId: string; status: string }) => {
      orderServices.updateStatusOrder(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['order'],
      });
      toast.success('Payment successful !', {
        position: 'top-center',
      });
    },
  });

  const handlePayNow = (orderId: string, status: string) => {
    updateStatusOrderMutation.mutateAsync({
      orderId,
      status,
    });
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-100">
        <div className="mx-auto w-[80%] pt-10 lg:w-[70%]">
          <h1 className="!mb-10 text-[1.3rem] !font-bold">My orders</h1>
          <div>
            {isSuccess ? (
              <div>
                {orders.data.metadata.map((order: OrderType) => {
                  return (
                    <div key={order._id} className="mb-6 bg-white shadow-xl">
                      <OrderItem data={order} />
                      <div className="flex w-full items-end justify-between p-4">
                        <div>
                          <p className="!m-0 text-[1.1rem] font-bold text-orange-600">
                            {order.status.toUpperCase()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex gap-2">
                            <p>Order total: </p>
                            <span className="font-bold text-orange-600">
                              {order.totalAmount.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <button className="cursor-pointer border border-gray-400 px-4 py-2 !text-black hover:opacity-60">
                              Buy again
                            </button>
                            <button
                              disabled={order.status === 'paid'}
                              className={`cursor-pointer bg-orange-600 px-4 py-2 !text-white ${order.status === 'paid' ? '!cursor-not-allowed opacity-60' : 'hover:opacity-80'} `}
                              onClick={() => handlePayNow(order._id, 'paid')}
                            >
                              Pay Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">No orders</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
