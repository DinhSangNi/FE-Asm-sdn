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
import { productsService } from '@/lib/api/products';
import { Product } from '@/store/types';
import Image from 'next/image';

type Props = {
  mutate: (value: z.infer<typeof updateProductFormSchema>) => void;
  id: string;
};

export const updateProductFormSchema = z.object({
  name: z.string().min(2, {
    message: `Product's name must be at least 2 characters.`,
  }),
  description: z.string(),
  price: z.number().min(0, {
    message: 'Price must greater than 0',
  }),
  files: z.array(z.instanceof(File)),
});

export default function UpdateProductForm({ mutate, id }: Props) {
  const [product, setProduct] = useState<Product>();
  const form = useForm<z.infer<typeof updateProductFormSchema>>({
    resolver: zodResolver(updateProductFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      files: [],
    },
  });

  const [previewImage, setPreviewImage] = useState<string[]>(() => {
    return (product?.image as string[] | undefined) ?? [];
  });

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
  function onSubmit(values: z.infer<typeof updateProductFormSchema>) {
    if (!values) return;
    mutate(values);
  }

  useEffect(() => {
    return () => {
      if (previewImage) {
        previewImage.forEach((pre) => URL.revokeObjectURL(pre));
      }
    };
  }, [previewImage]);

  const fetchProductDetails = async () => {
    try {
      const res = await productsService.getProductById(id);
      if (res.status === 200) {
        const metadata: Product = res.data.metadata;
        form.reset({
          name: metadata.name,
          description: metadata.description,
          price: metadata.price,
          files: [],
        });

        setPreviewImage(metadata.image);
        setProduct(metadata);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

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
              <Image
                width={500}
                height={500}
                key={prev}
                className="h-20 w-20 rounded-lg"
                src={prev}
                alt="preview-image"
              />
            ))}
          </div>
        )}
        <Button className="cursor-pointer" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
