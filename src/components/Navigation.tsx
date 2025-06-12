'use client';

import UserIcon from '../../public/icons/UserIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { List } from 'lucide-react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { Suspense } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { logout } from '@/store/userSlice';

const Navigation = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogOut = async () => {
    await signOut({ redirect: false });
    dispatch(logout());
    router.push('/auth/login');
  };

  const user = useSelector((state: RootState) => state.user);

  return (
    <>
      <div className="fixed z-50 flex h-[64px] w-full justify-center bg-white py-4 opacity-90 shadow-md">
        <div className="flex w-[90%] items-center gap-4 md:gap-6 lg:gap-12">
          <Link href="/" className="text-[1.2rem] font-bold">
            Assignment 1
          </Link>
          <div className="flex-2">
            <Suspense fallback={<p>Loading search...</p>}>
              <SearchBar />
            </Suspense>
          </div>
          <div>
            <Link
              href="/products"
              className="flex cursor-pointer items-center gap-2 hover:opacity-60"
            >
              {user.userId && (
                <>
                  <List className="h-5 w-5" />
                  <p className="hidden text-[0.8rem] font-bold md:block">
                    Product Management
                  </p>
                </>
              )}
            </Link>
          </div>
          <div className="flex justify-end gap-2 text-[0.8rem] font-bold">
            {user.userId ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer outline-none">
                  <div className="w-fit rounded-full bg-gray-300 p-1 hover:bg-gray-400">
                    <UserIcon className="h-6 w-6" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer font-bold">
                    <div className="flex flex-col items-center p-2 shadow-xl">
                      <p>{user.name}</p>
                      <p className="text-[0.8rem] font-normal">{user.email}</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer font-bold"
                    onClick={handleLogOut}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="cursor-pointer px-2 py-1 hover:bg-gray-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="cursor-pointer px-2 py-1 hover:bg-gray-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
