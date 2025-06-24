import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react';
import QuantityStepper from './QuantityStepper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CartServices } from '@/lib/api/cart';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { removeFromCart } from '@/store/cartSlice';
import { isInteger } from '@/utils/numberUtils';
import { useRouter } from 'next/navigation';

type Props = {
  data: {
    id: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
  };
  checked?: boolean;
  onSelect?: (value: string) => void;
};

const CartItem = ({ data, checked, onSelect }: Props) => {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState<number>(data.quantity);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const addMutation = useMutation({
    mutationFn: async () => {
      return await CartServices.addToCart({
        productId: data.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      });
      // dispatch(addToCart(data));
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      return await CartServices.removeFromCart({
        productId: data.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      });
      // dispatch(removeFromCart(data.id));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      return await CartServices.updateCart({
        productId: data.id,
        quantity: quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await CartServices.deleteCart({
        productIds: [data.id],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      });
      dispatch(removeFromCart(data.id));
    },
  });

  const handleIncrease = async () => {
    setQuantity((prev) => prev + 1);
    addMutation.mutateAsync();
  };

  const handleDecrease = async () => {
    if (quantity === 1) return;
    setQuantity((prev) => prev - 1);
    removeMutation.mutateAsync();
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') setQuantity(1);
    if (!isInteger(e.target.value)) return;
    const value = parseInt(e.target.value);
    if (value <= 0) return;
    setQuantity(value);
  };

  const handleOnEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await updateMutation.mutateAsync();
    }
  };

  const handleOnBlur = async () => {
    await updateMutation.mutateAsync();
  };
  const handleDelete = () => {
    deleteMutation.mutateAsync();
  };

  return (
    <>
      <div className="flex h-[150px] w-full items-center justify-between border-b border-gray-300 bg-white px-6 py-6">
        <div>
          <input
            checked={checked}
            type="checkbox"
            className="h-5 w-5"
            onChange={() => {
              if (!onSelect) return;
              onSelect(data.id);
            }}
          />
        </div>
        <div
          className="flex h-full cursor-pointer items-center justify-start gap-10"
          onClick={() => router.push(`/products/${data?.id}`)}
        >
          <Image
            src={data.image}
            alt="item_image"
            width={500}
            height={500}
            className="aspect-auto h-full w-auto"
          />
          <h1 className="!m-0 line-clamp-1 w-[270px] flex-1 text-[1.1rem] !font-bold">
            {data.name}
          </h1>
        </div>

        <div>
          <p className="!m-0 w-[75px] text-[0.9rem]">
            {parseFloat(data.price).toLocaleString('vi-VN')}đ
          </p>
        </div>
        <QuantityStepper
          className="h-1/3 w-fit"
          value={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onChange={handleQuantityChange}
          onKeyDown={handleOnEnter}
          onBlur={handleOnBlur}
        />
        <div>
          <p className="!m-0 w-[75px] text-[0.9rem] font-bold">
            {(parseFloat(data.price) * data?.quantity).toLocaleString('vi-VN')}đ
          </p>
        </div>
        <div>
          <button
            className="!m-0 cursor-pointer text-[0.9rem] transition-colors duration-150 hover:!text-orange-600"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default CartItem;
