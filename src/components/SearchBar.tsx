'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { productsService } from '@/lib/api/products';
import { PaginationProductsResponse, Product } from '@/store/types';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedList, setSearchedList] = useState<Product[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const router = useRouter();

  const callSearchAPi = async () => {
    try {
      const res = await productsService.getProducts({
        keyword: searchQuery,
      });
      if (res.status === 200) {
        const response: PaginationProductsResponse = res.data;
        setSearchedList(response.metadata.data);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchedList([]);
      return;
    }

    if (searched) {
      setSearched(false);
      return;
    }

    const debounce = setTimeout(callSearchAPi, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <>
      <div className="relative">
        <div className="flex rounded-3xl border-[1px]">
          <Input
            value={searchQuery}
            placeholder="Search product..."
            className="border-none"
            onChange={handleSearch}
          />
          <button className="cursor-pointer pr-2 hover:opacity-60">
            <Search />
          </button>
        </div>
        {searchedList.length > 0 && (
          <div className="shadow-3xl absolute top-[100%] max-h-[300px] w-full overflow-y-auto border-[1px] border-gray-200 bg-white pt-2 text-[0.8rem]">
            {searchedList.map((pro) => (
              <div
                key={pro._id}
                className="w-full cursor-pointer px-3 py-2 hover:bg-gray-100"
                onClick={() => {
                  setSearchQuery(pro.name);
                  setSearchedList([]);
                  setSearched(true);
                  router.push(`/products/${pro._id}`);
                }}
              >
                {pro.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
