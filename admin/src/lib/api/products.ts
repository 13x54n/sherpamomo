import apiRequest from './client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock: number;
  featured: boolean;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  inStock: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

// Get all products with pagination and filters
export async function getProducts(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  inStock?: boolean;
} = {}): Promise<{ products: Product[]; total: number; page: number; pages: number }> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return apiRequest(`/products?${searchParams.toString()}`);
}

// Get single product
export async function getProduct(id: string): Promise<Product> {
  return apiRequest(`/products/${id}`);
}

// Create product
export async function createProduct(product: CreateProductRequest): Promise<Product> {
  return apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

// Update product
export async function updateProduct(product: UpdateProductRequest): Promise<Product> {
  const { id, ...updateData } = product;
  return apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  return apiRequest(`/products/${id}`, {
    method: 'DELETE',
  });
}

// Get categories
export async function getCategories(): Promise<string[]> {
  return apiRequest('/products/categories');
}