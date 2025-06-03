import { AxiosInstance } from 'axios';
import { axiosInstance } from '../config/axios';

export type ProductCreateDto = {
  name: string;
  description: string;
  price: number;
  files: File[];
};

export type ProductUpdateDto = {
  name: string;
  description: string;
  price: number;
  files: File[];
};

export type ProductQueryDto = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
};

class ProductsService {
  private api: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.api = axiosInstance;
  }

  async getProducts(productQuery: ProductQueryDto) {
    return await this.api.get(
      `/products/?${productQuery.keyword ? `keyword=${productQuery.keyword}&` : ''}page=${productQuery.page ?? 1}&pageSize=${productQuery.pageSize ?? 10}${productQuery.minPrice ? `&minPrice=${productQuery.minPrice}` : ''}${productQuery.maxPrice ? `&maxPrice=${productQuery.maxPrice}` : ''}`
    );
  }

  async getProductById(id: string) {
    return await this.api.get(`/products/${id}`);
  }

  async create(product: ProductCreateDto) {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    product.files.forEach((file) => {
      formData.append('files', file);
    });

    return await this.api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async update(product: ProductUpdateDto, id: string) {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    if (product.files.length > 0) {
      product.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    return await this.api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async delete(id: string) {
    return await this.api.delete(`/products/${id}`);
  }
}

export const productsService = new ProductsService(axiosInstance);
