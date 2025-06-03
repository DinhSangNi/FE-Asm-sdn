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

export enum ProductDialogEnum {
  UPDATE = 'update',
  CREATE = 'create',
}

type Props = {};

const ProductDialog = ({}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (newProduct: z.infer<typeof createProductFormSchema>) =>
      productsService.create(newProduct),
    onSuccess: () => {
      router.refresh();
      setOpen(!open);
    },
    onError: (error) => {
      console.log('error:', error);
      setOpen(!open);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="flex cursor-pointer items-center gap-1 rounded-md bg-blue-500 p-2 text-[0.8rem] font-bold text-white hover:bg-blue-600">
          <p>Create</p>
          <Plus className="h-5 w-5" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4 text-[1.2rem]">
              Create Product
            </DialogTitle>
            {/* <div className="h-full w-full"> */}
            <CreateProductForm
              mutate={mutation.mutate}
              loading={mutation.isPending}
              isSuccess={mutation.isSuccess}
            />
            {/* </div> */}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductDialog;
