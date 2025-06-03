'use client';

import { productsService } from '@/lib/api/products';
import { Product } from '@/store/types';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const ProductDetails = () => {
  const params = useParams();
  const slug = params.slug;

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
            <div className="mb-4 flex gap-4">
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
              <p className="mb-4 text-[1.4rem] font-bold">
                {product?.price.toLocaleString('vi-VN') + ' ₫'}
              </p>
              <div className="flex">
                <button className="w-full cursor-pointer border-[1px] border-red-500 px-6 py-2 font-bold text-red-500 hover:opacity-60">
                  Add to cart
                </button>
                <button className="w-full cursor-pointer bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-700">
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
