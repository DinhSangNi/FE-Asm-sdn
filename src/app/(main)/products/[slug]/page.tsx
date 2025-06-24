'use client';

import QuantityStepper from '@/components/QuantityStepper';
import { CartServices } from '@/lib/api/cart';
import { productsService } from '@/lib/api/products';
import { addToCart } from '@/store/cartSlice';
import { AppDispatch } from '@/store/store';
import { Product } from '@/store/types';
import { isInteger } from '@/utils/numberUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const ProductDetails = () => {
  const params = useParams();
  const slug = params.slug;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['products', slug],
    queryFn: () => {
      return productsService.getProductById(slug as string);
    },
  });

  let product: Product | null = null;

  if (data) {
    product = data.data.metadata;
  }

  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState<number>(1);

  const addMutation = useMutation({
    mutationFn: async () => {
      CartServices.addToCart({
        productId: product?._id as string,
        quantity: quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      });
      toast.success('Added to cart successfully ', {
        position: 'top-center',
      });
    },
  });

  const handleAddToCart = async () => {
    if (!product) return;
    await addMutation.mutateAsync();
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price.toString(),
        image: product.image[0],
        quantity: 1,
      })
    );
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity === 0) return;
    setQuantity((prev) => prev - 1);
  };

  const handleOnChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isInteger(e.target.value)) return;
    if (Number(e.target.value) < 0) return;
    setQuantity(Number(e.target.value.trim()));
  };

  return (
    <div className="mx-auto mt-6 h-full w-[90%]">
      {data ? (
        <div className="flex gap-6">
          <div className="flex flex-1 justify-center">
            <div className="w-4/5">
              <Image
                width={800}
                height={800}
                src={data?.data.metadata.image[0]}
                alt={`product's image`}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="">
              <h1 className="text-[1.8rem] font-bold">
                {data?.data.metadata.name}
              </h1>
              <p className="mt-3 h-[100px] text-gray-600">
                {product?.description}
              </p>
            </div>
            <div className="mb-8 flex gap-4">
              <button className="h-[35px] w-[35px] cursor-pointer border-[1px] border-black text-center hover:border-none hover:bg-red-300">
                S
              </button>
              <button className="h-[35px] w-[35px] cursor-pointer border-[1px] border-black text-center hover:border-none hover:bg-red-300">
                M
              </button>
              <button className="h-[35px] w-[35px] cursor-pointer border-[1px] border-black text-center hover:border-none hover:bg-red-300">
                L
              </button>
              <button className="h-[35px] w-[35px] cursor-pointer border-[1px] border-black text-center hover:border-none hover:bg-red-300">
                XL
              </button>
            </div>
            <div className="w-full">
              <QuantityStepper
                value={quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onChange={handleOnChangeQuantity}
              />
              <p className="!my-8 text-[1.4rem] font-bold">
                {product?.price.toLocaleString('vi-VN') + ' ₫'}
              </p>
              <div className="flex">
                <button
                  className="w-full cursor-pointer border-[1px] border-red-500 px-6 py-2 font-bold text-red-500 hover:opacity-60"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </button>
                <button
                  className="w-full cursor-pointer bg-red-500 px-6 py-2 font-bold !text-white hover:bg-red-700"
                  onClick={async () => {
                    await handleAddToCart();
                    router.push('/cart');
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ProductDetails;
