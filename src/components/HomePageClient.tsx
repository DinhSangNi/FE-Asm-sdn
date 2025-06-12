'use client';

import Pagination from '@/components/Pagination';
import ProductCard from '@/components/ProductCard';
import { productsService } from '@/lib/api/products';
import { PaginationProductsResponse, Product } from '@/store/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

enum PriceFilter {
  ALL = 'all',
  UNDER1M = 'under1m',
  FROM1MTO5M = 'from1mto5m',
  ABOVE5M = 'above5m',
}

export default function HomePageClient() {
  const [priceFilter, setPriceFilter] = useState(PriceFilter.ALL);

  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  const pageSize = searchParams.get('pageSize')
    ? parseInt(searchParams.get('pageSize') as string)
    : 2;

  const minPrice = searchParams.get('minPrice')
    ? parseFloat(searchParams.get('minPrice') as string)
    : undefined;
  const maxPrice = searchParams.get('maxPrice')
    ? parseFloat(searchParams.get('maxPrice') as string)
    : undefined;

  const { data, isError } = useQuery({
    queryKey: ['products', `${page}`, minPrice, maxPrice],
    queryFn: () => {
      return productsService.getProducts({
        page: page,
        pageSize: pageSize,
        minPrice,
        maxPrice,
      });
    },
  });

  const response: PaginationProductsResponse = data?.data;
  const products: Product[] = response?.metadata.data;

  const query = Object.fromEntries(searchParams.entries());

  if (page !== undefined) {
    query.page = page.toString();
  }

  if (pageSize !== undefined) {
    query.pageSize = pageSize.toString();
  }

  if (minPrice !== undefined) {
    query.minPrice = minPrice.toString();
  }

  if (maxPrice !== undefined) {
    query.maxPrice = maxPrice.toString();
  }

  const handleNext = () => {
    query.page = (Number(query.page) + 1).toString();
    const url = Object.entries(query)
      .map(([Key, value]) => `${Key}=${value}`)
      .join('&');
    router.push(`/?${url}`);
  };

  const handlePrevious = () => {
    query.page = (Number(query.page) - 1).toString();
    const url = Object.entries(query)
      .map(([Key, value]) => `${Key}=${value}`)
      .join('&');
    router.push(`/?${url}`);
  };

  const handlePriceFilterChange = (value: PriceFilter) => {
    if (value === PriceFilter.UNDER1M) {
      router.push(
        `/?page=${page}&pageSize=${pageSize}&minPrice=0&maxPrice=${1000000}`
      );
    } else if (value === PriceFilter.FROM1MTO5M) {
      router.push(
        `/?page=${page}&pageSize=${pageSize}&minPrice=${1000000}&maxPrice=${5000000}`
      );
    } else if (value === PriceFilter.ABOVE5M) {
      router.push(`/?page=${page}&pageSize=${pageSize}&minPrice=${5000000}`);
    } else {
      router.push(`/?page=${page}&pageSize=${pageSize}`);
    }

    setPriceFilter(value);
  };

  useEffect(() => {
    if (minPrice === undefined && maxPrice === undefined) {
      setPriceFilter(PriceFilter.ALL);
    } else if (minPrice === 0 && maxPrice === 1000000) {
      setPriceFilter(PriceFilter.UNDER1M);
    } else if (minPrice === 1000000 && maxPrice === 5000000) {
      setPriceFilter(PriceFilter.FROM1MTO5M);
    } else if (minPrice === 5000000 && maxPrice === undefined) {
      setPriceFilter(PriceFilter.ABOVE5M);
    }
  }, [minPrice, maxPrice]);

  return (
    <>
      <div className="h-full w-full">
        <div className="mx-auto mt-10 w-[90%]">
          <Select value={priceFilter} onValueChange={handlePriceFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PriceFilter.ALL}>All</SelectItem>
              <SelectItem value={PriceFilter.UNDER1M}>
                Under 1.000.000
              </SelectItem>
              <SelectItem value={PriceFilter.FROM1MTO5M}>
                1.000.000 - 5.000.000
              </SelectItem>
              <SelectItem value={PriceFilter.ABOVE5M}>
                Above 5.000.000
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!isError && (
          <>
            <div className="mx-auto mt-6 grid w-[90%] grid-cols-2 gap-8 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {products?.map((pro: Product) => {
                return (
                  <Link
                    className="p-0"
                    href={`/products/${pro._id}`}
                    key={pro._id}
                  >
                    <ProductCard data={pro} />
                  </Link>
                );
              })}
            </div>
            <div className="mx-auto mt-4 flex w-[90%] justify-center">
              <Pagination
                total={response?.metadata.total}
                page={page}
                pageSize={pageSize}
                totalPages={response?.metadata.totalPages}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
