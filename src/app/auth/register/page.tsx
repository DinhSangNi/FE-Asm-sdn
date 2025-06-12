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
import { AuthService } from '@/lib/api/auth';
import { AppDispatch } from '@/store/store';
import { login } from '@/store/userSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

export const registerFormSchema = z.object({
  fullname: z.string().min(1, { message: 'Please input your fullname' }),
  email: z.string().email({ message: 'Invalid email!' }).min(1, {
    message: 'Please input your email!',
  }),
  password: z.string().min(6, {
    message: 'Please input your password!',
  }),
});

const RegisterPage = () => {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    try {
      setLoading(true);
      const res = await AuthService.register(
        values.fullname,
        values.email,
        values.password
      );
      if (res.status === 201) {
        console.log('res: ', res);
        const feRes = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (feRes?.ok) {
          dispatch(
            login({
              userId: res.data.metadata._id,
              name: res.data.metadata.name,
              email: res.data.metadata.email,
              avartar: res.data.metadata.avartar ?? '',
            })
          );
        }
        toast.success('Login successfully!', {
          position: 'top-center',
        });
        router.push('/');
      }
    } catch (error) {
      console.log('error: ', error);
      toast.error(error.response.data!.message, {
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
              Sign Up
            </h1>

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FullName</FormLabel>
                  <FormControl>
                    <Input placeholder="Your fullname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input
                      type="password"
                      placeholder="Your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} className="cursor-pointer">
              Sign up {loading && <Spinner />}
            </Button>
            <p className="w-full text-center text-[0.9rem]">
              Already have an account?{' '}
              <Link href="/auth/login" className="cursor-pointer underline">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </>
  );
};

export default RegisterPage;
