export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
};

export type Order = {
  _id: string;
  userId: string;
  items: { productId: Product; quantity: number; _id: string }[];
  totalAmount: number;
  status: string;
};
