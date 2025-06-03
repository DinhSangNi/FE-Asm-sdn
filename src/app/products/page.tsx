'use client';

import { Product } from '@/store/types';
import ProductDialog from '@/components/ProductDialog';
import ProductsList from '@/components/ProductsList';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/lib/api/products';
import Pagination from '@/components/Pagination';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState({
    page: 1,
    pageSize: 2,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 2,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  const { data, isError } = useQuery({
    queryKey: ['products', query.page, query.pageSize],
    queryFn: () => {
      return productsService.getProducts(query);
    },
  });

  const handleNext = () => {
    setQuery((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const handlePrevious = () => {
    setQuery((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  useEffect(() => {
    if (!isError) {
      console.log('data: ', data);
      setProducts(data?.data.metadata.data);
      setPagination({
        page: query.page,
        pageSize: query.pageSize,
        total: data?.data.metadata.total,
        totalPages: data?.data.metadata.totalPages,
        hasMore: data?.data.metadata.hasMore,
      });
    }
  }, [data]);

  return (
    <>
      <div className="mx-auto mt-6 w-[90%]">
        <div className="mb-4 flex justify-between">
          <div>
            <h1 className="font-bold">Products Management</h1>
          </div>
          <div>
            <ProductDialog />
          </div>
        </div>
        {products && <ProductsList data={products} />}
        <div className="mt-4 flex w-full justify-end">
          <Pagination
            page={query?.page}
            pageSize={query?.pageSize}
            total={pagination?.total}
            totalPages={pagination?.totalPages}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
