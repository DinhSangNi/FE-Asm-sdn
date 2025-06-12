'use client';

import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { login } from '@/store/userSlice';

const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email!' }).min(1, {
    message: 'Please input your email!',
  }),
  password: z.string().min(6, {
    message: 'Please input your password!',
  }),
});

const LoginPage = () => {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    try {
      setLoading(true);
      if (!values) return;
      setLoading(true);
      const res = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error('Error next auth', {
          position: 'top-center',
        });
      } else {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();

        // Set Redux
        dispatch(
          login({
            userId: session.user.id,
            name: session.user.name,
            email: session.user.email,
            avartar: session.user.avartar ?? '',
          })
        );
        toast.success('Login successfully!', {
          position: 'top-center',
        });
        router.push('/');
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error('Register failed!', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center bg-gray-200">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-[40%] flex-col gap-4 bg-white p-10 shadow-xl"
          >
            <h1 className="my-6 w-full text-center text-[1.6rem] font-bold">
              Sign In
            </h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} className="cursor-pointer">
              Sing in {loading && <Spinner />}
            </Button>

            <p className="w-full text-center text-[0.9rem]">
              {`Don't have an account? `}
              <Link href="/auth/register" className="cursor-pointer underline">
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
