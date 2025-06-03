'use client';

import { Product } from '@/store/types';
import { ColumnDef } from '@tanstack/react-table';
import ProductDetailsDialog from '@/components/ProductDetailsDialog';
import { FilePenLine, X } from 'lucide-react';
import { TMeta } from '@/components/ui/data-table';

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => row.original.price.toLocaleString('vi-VN') + ' ₫',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const product = row.original;
      const meta = table.options.meta as TMeta;

      return (
        <div className="flex gap-2">
          {/* <ProductDetailsDialog id={product._id} /> */}
          <X
            className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => meta.onDelete(product._id)}
          />
          <FilePenLine
            className="h-4 w-4 cursor-pointer text-orange-500 hover:text-orange-700"
            onClick={() => meta.onUpdate(product._id)}
          />
        </div>
      );
    },
  },
];
