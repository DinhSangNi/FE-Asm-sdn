'use client';

import UserIcon from '../../public/icons/UserIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { List, ShoppingCart, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { Suspense, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { logout } from '@/store/userSlice';
import { Badge } from 'antd';
import { CartServices } from '@/lib/api/cart';
import { fetchCart } from '@/store/cartSlice';

const Navigation = () => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const cart = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const fetchCartFromDB = async () => {
      try {
        if (pathName.startsWith('/auth')) {
          return;
        }
        const res = await CartServices.getItemsInCart();
        if (res.status === 200) {
          const resolvedCart = res.data.metadata.items.map(
            (item: {
              productId: {
                _id: string;
                name: string;
                price: number;
                image: string[];
              };
              quantity: number;
            }) => {
              return {
                id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                image: item.productId.image[0],
                quantity: item.quantity,
              };
            }
          );

          dispatch(fetchCart(resolvedCart));
        }
      } catch (error) {
        console.log('error: ', error);
      }
    };

    fetchCartFromDB();
  }, [user]);

  if (pathName.startsWith('/auth'))
    return <div className="fixed -z-10 h-[64px] w-full bg-gray-200"></div>;

  const handleLogOut = async () => {
    await signOut({ redirect: false });
    dispatch(logout());
    router.push('/auth/login');
  };

  return (
    <>
      <div className="fixed z-50 flex h-[64px] w-full justify-center bg-white py-4 opacity-100 shadow-md">
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
            {user.userId && (
              <div className="flex gap-4">
                <Link href="/cart" className="cursor-pointer">
                  <Badge count={cart.items.length}>
                    <ShoppingCart className="h-5 w-5" />
                  </Badge>
                </Link>
              </div>
            )}
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
                  <DropdownMenuItem>
                    <Link
                      href="/products"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <List className="h-5 w-5 text-black" />
                      <p
                        className="text-[0.8rem] font-bold md:block"
                        style={{ margin: 0 }}
                      >
                        Product Management
                      </p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/order"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <ClipboardList className="h-5 w-5 text-black" />
                      <p
                        className="text-[0.8rem] font-bold md:block"
                        style={{ margin: 0 }}
                      >
                        My orders
                      </p>
                    </Link>
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
