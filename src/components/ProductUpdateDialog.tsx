'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import CreateProductForm, {
  createProductFormSchema,
} from './CreateProductForm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { productsService } from '@/lib/api/products';
import { z } from 'zod';
import UpdateProductForm, {
  updateProductFormSchema,
} from './UpdateProductForm';

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  id: string;
};

const ProductUpdateDialog = ({ open, onOpenChange, id }: Props) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (updatedProduct: z.infer<typeof updateProductFormSchema>) =>
      productsService.update(updatedProduct, id),
    onSuccess: () => {
      router.refresh();
      onOpenChange(!open);
    },
    onError: (error) => {
      console.log('error:', error);
      onOpenChange(!open);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4 text-[1.2rem]">
              Update Product
            </DialogTitle>
            <UpdateProductForm id={id} mutate={mutation.mutate} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductUpdateDialog;
