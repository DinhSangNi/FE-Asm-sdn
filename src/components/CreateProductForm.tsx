'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { ChangeEvent, useEffect, useState } from 'react';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';

type Props = {
  mutate: (values: z.infer<typeof createProductFormSchema>) => void;
  loading: boolean;
  isSuccess: boolean;
};

export const createProductFormSchema = z.object({
  name: z.string().min(2, {
    message: `Product's name must be at least 2 characters.`,
  }),
  description: z.string(),
  price: z.number().min(0, {
    message: 'Price must greater than 0',
  }),
  files: z.array(z.instanceof(File)),
});

export default function CreateProductForm({
  mutate,
  loading,
  isSuccess,
}: Props) {
  const form = useForm<z.infer<typeof createProductFormSchema>>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      files: undefined,
    },
  });

  const router = useRouter();

  const [previewImage, setPreviewImage] = useState<string[]>([]);

  const handlePreviewImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('files: ', files);
    if (!files) return;
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]);
      urls.push(url);
    }
    setPreviewImage(urls);
  };
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createProductFormSchema>) {
    if (!values) return;
    mutate(values);
    if (isSuccess) {
      router.refresh();
    }
  }

  useEffect(() => {
    return () => {
      if (previewImage) {
        previewImage.forEach((pre) => URL.revokeObjectURL(pre));
      }
    };
  }, [previewImage]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Product's description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Product's price"
                  {...rest}
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    onChange(price);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="files"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      onChange(files);
                      handlePreviewImage(e);
                    }
                  }}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {previewImage.length > 0 && (
          <div className="flex gap-2">
            {previewImage.map((prev) => (
              <img
                key={prev}
                className="h-20 w-20 rounded-lg"
                src={prev}
                alt="preview-image"
              />
            ))}
          </div>
        )}
        <Button disabled={loading} type="submit" className="cursor-pointer">
          Submit {loading && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
