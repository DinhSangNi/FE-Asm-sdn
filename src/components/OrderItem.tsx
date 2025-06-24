'use client';
import { Order } from '@/types/type';
import React from 'react';

type Props = {
  data: Order;
};

const OrderItem = ({ data }: Props) => {
  console.log('order: ', data);
  return (
    <>
      <div className="w-full">
        {data.items.map((item) => {
          return (
            <div
              className="flex h-[150px] w-full gap-4 border-b-2 border-gray-200 bg-white p-4"
              key={item.productId._id}
            >
              <img
                src={item.productId.image[0]}
                alt="product_image"
                className="h-full w-auto"
              />
              <div>
                <h1 className="">{item.productId.name}</h1>
                <p className="!m-0 text-[0.8rem]">x{item.quantity}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OrderItem;
