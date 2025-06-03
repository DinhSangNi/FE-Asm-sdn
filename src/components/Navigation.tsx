// 'use client';

import UserIcon from '../../public/icons/UserIcon';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { List, Search } from 'lucide-react';
import Link from 'next/link';
import SearchBar from './SearchBar';

type Props = {};

const Navigation = (props: Props) => {
  return (
    <>
      <div className="fixed z-50 flex h-[64px] w-full justify-center bg-white py-4 opacity-90 shadow-md">
        <div className="flex w-[90%] items-center gap-4 md:gap-6 lg:gap-12">
          <Link href="/" className="text-[1.2rem] font-bold">
            Assignment 1
          </Link>
          <div className="flex-2">
            <SearchBar />
          </div>
          <div>
            <Link
              href="/products"
              className="flex cursor-pointer items-center gap-2 hover:opacity-60"
            >
              <List className="h-5 w-5" />
              <p className="hidden text-[0.8rem] font-bold md:block">
                Product Management
              </p>
            </Link>
          </div>
          <div className="flex justify-end gap-14 lg:gap-14">
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer outline-none">
                <div className="w-fit rounded-full bg-gray-300 p-1 hover:bg-gray-400">
                  <UserIcon className="h-6 w-6" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-bold">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-bold">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
