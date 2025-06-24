'use client';

import CartItem from '@/components/CartItem';
import { useCart } from '@/hooks/cart';
import { CartServices } from '@/lib/api/cart';
import { orderServices } from '@/lib/api/order';
import { clearCart } from '@/store/cartSlice';
import { AppDispatch } from '@/store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const Cart = () => {
  const { data: cartRes, isSuccess } = useCart();
  const [selectItems, setSelectedItems] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const items = cartRes.metadata.items.filter(
        (item: {
          productId: {
            _id: string;
          };
        }) => selectItems.includes(item.productId._id)
      );
      const resolvedItems = items.map(
        (item: {
          productId: {
            _id: string;
          };
          quantity: number;
        }) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })
      );
      return await orderServices.createOrder({
        items: resolvedItems,
        totalAmount: computeTotalPrice(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await CartServices.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      dispatch(clearCart());
      router.push('/order');
    },
  });

  const handleSelect = (productId: string) => {
    if (selectItems.includes(productId)) {
      setSelectedItems((prev) => prev.filter((id) => id != productId));
    } else {
      setSelectedItems((prev) => [...prev, productId]);
    }
  };

  const handleSelectAll = () => {
    if (cartRes.metadata.items.length === selectItems.length) {
      setSelectedItems([]);
    } else {
      const productIds = cartRes.metadata.items.map(
        (item: {
          productId: {
            _id: string;
          };
        }) => item.productId._id
      );
      setSelectedItems(productIds);
    }
  };

  const computeTotalPrice = (): number => {
    const items = cartRes.metadata.items.filter(
      (item: {
        productId: {
          _id: string;
        };
      }) => selectItems.includes(item.productId._id)
    );

    const totalPrice = items.reduce(
      (
        acc: number,
        item: {
          productId: {
            _id: string;
            price: number;
          };
          quantity: number;
        }
      ) => {
        return acc + item.productId.price * item.quantity;
      },
      0
    );

    return totalPrice as number;
  };

  const handleOnBuy = async () => {
    if (selectItems.length === 0) {
      toast.error('You have not selected any items for checkout', {
        position: 'top-center',
      });
      return;
    }
    await createOrderMutation.mutateAsync();
    await clearCartMutation.mutateAsync();
  };

  useEffect(() => {
    if (isSuccess) {
      setTotalPrice(computeTotalPrice());
    }
  }, [cartRes, selectItems, isSuccess]);

  return (
    <>
      <div className="min-h-screen w-full bg-gray-100">
        <div className="mx-auto w-[80%] pt-10 lg:w-[70%]">
          <h1 className="text-[1.3rem] !font-bold">Cart</h1>
          <div>
            {cartRes?.metadata?.items.length === 0 ? (
              <p className="text-center text-gray-500">Empty Cart</p>
            ) : (
              <div>
                {cartRes?.metadata?.items.map(
                  (item: {
                    _id: string;
                    productId: {
                      _id: string;
                      name: string;
                      price: string;
                      image: string[];
                    };
                    quantity: number;
                  }) => {
                    const resolvedItem = {
                      id: item.productId._id,
                      name: item.productId.name,
                      price: item.productId.price,
                      image: item.productId.image[0],
                      quantity: item.quantity,
                    };
                    return (
                      <div key={item._id}>
                        <CartItem
                          data={resolvedItem}
                          checked={selectItems.includes(resolvedItem.id)}
                          onSelect={handleSelect}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
          {cartRes?.metadata?.items.length !== 0 && (
            <div className="sticky bottom-0 z-10 mt-6 flex w-full items-center justify-between bg-white p-6 shadow-2xl">
              <div className="flex items-center gap-6">
                <input
                  type="checkbox"
                  checked={
                    cartRes?.metadata?.items.length === selectItems.length
                  }
                  className="h-5 w-5"
                  onChange={handleSelectAll}
                />
                <p className="!m-0">{`Select All (${cartRes?.metadata?.items.length ? cartRes?.metadata?.items.length : '0'})`}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="!m-0 flex items-center gap-2">
                  <p className="!m-0">
                    Total {`(${selectItems.length} items):`}
                  </p>
                  <span className="text-[1.2rem] text-orange-600">
                    {totalPrice.toLocaleString('vi-Vn')}đ
                  </span>
                </div>
                <button
                  className="cursor-pointer bg-orange-600 px-6 py-2 !text-white hover:opacity-80"
                  onClick={handleOnBuy}
                >
                  Buy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
