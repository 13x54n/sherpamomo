export interface Product {
  id: string; // Primary ID field (transformed from MongoDB _id)
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  ingredients: string[];
  amount: number;
  unit: string;
  featured?: boolean;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}