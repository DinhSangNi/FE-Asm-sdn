export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type PaginationProductsResponse = {
  message: string;
  metadata: {
    data: [];
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
};
