'use client';

import { productsService } from '@/lib/api/products';
import { DataTable } from './ui/data-table';
import { productColumns } from '@/lib/tables/ProductColumn';
import { Product } from '@/store/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import { CircleX, X } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';
import ProductUpdateDialog from './ProductUpdateDialog';

type Props = {
  data: Product[];
};

const ProductsList = ({ data }: Props) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      router.refresh();
      setOpen(false);
    },
    onError: (error: any) => {
      console.log('error: ', error);
    },
  });

  const handleDeleteModalOpen = (id: string) => {
    setSelectedId(id);
    setOpen(!open);
  };

  const handleUpdateModalOpen = (id: string) => {
    setSelectedId(id);
    setUpdateOpen(!updateOpen);
  };

  const handleDelete = () => {
    if (!selectedId || selectedId.length === 0) return;
    mutation.mutate(selectedId);
    if (mutation.isSuccess) {
      router.refresh();
    }
  };

  const handleCancel = () => {
    setSelectedId('');
    setOpen(false);
  };

  return (
    <>
      <div>
        <DataTable
          columns={productColumns}
          data={data}
          meta={{
            onDelete: handleDeleteModalOpen,
            onUpdate: handleUpdateModalOpen,
          }}
        />
      </div>
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogContent className="flex flex-col items-center">
          <DialogTitle></DialogTitle>
          <h1>
            <CircleX className="h-20 w-20 text-red-500" />
          </h1>
          <p className="text-xl">Are you sure ?</p>
          <div className="flex gap-4 text-white">
            <button
              className="cursor-pointer bg-gray-400 p-2 hover:bg-gray-600"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="cursor-pointer bg-red-500 p-2 hover:bg-red-700"
              onClick={handleDelete}
            >
              Yes, delete it
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <ProductUpdateDialog
        id={selectedId}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
      />
    </>
  );
};

export default ProductsList;
