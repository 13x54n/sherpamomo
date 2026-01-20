import { Product } from '@/types/product';
import apiRequest from './client';

export interface ProductsResponse {
    products: Product[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalProducts: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface ProductFilters {
    category?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
    page?: number;
    sort?: string;
}

// Get all products with optional filtering
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
    });

    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    return apiRequest<ProductsResponse>(endpoint);
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
    return apiRequest<Product[]>('/products/featured');
}

// Get all product categories
export async function getProductCategories(): Promise<string[]> {
    const response = await apiRequest<{ categories: string[] }>('/products/categories');
    return response.categories;
}

// Get single product by ID
export async function getProduct(id: string): Promise<Product> {
    return apiRequest<Product>(`/products/${id}`);
}

// Create new product (admin only)
export async function createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return apiRequest<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    });
}

// Update product (admin only)
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    return apiRequest<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    });
}

// Delete product (admin only)
export async function deleteProduct(id: string): Promise<void> {
    await apiRequest(`/products/${id}`, {
        method: 'DELETE',
    });
}