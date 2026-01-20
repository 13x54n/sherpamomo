import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import connectDB from '../config/database';

dotenv.config();

// Product data from frontend/lib/data.ts
const frontendProducts = [
    {
        id: '1',
        name: 'Chicken Momo',
        description: 'Juicy chicken momos steamed to perfection. A classic Himalayan favorite.',
        price: 12.99,
        category: 'Chicken',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.8,
        reviewCount: 124,
        ingredients: ['Minced Chicken', 'Onion', 'Ginger', 'Garlic', 'Flour', 'Spices'],
        amount: 10,
        unit: 'pcs'
    },
    {
        id: '2',
        name: 'Paneer Momo',
        description: 'Soft momos stuffed with spiced paneer and fresh vegetables.',
        price: 11.49,
        category: 'Veg',
        image: 'https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg',
        rating: 4.6,
        reviewCount: 85,
        ingredients: ['Paneer (Cottage Cheese)', 'Cabbage', 'Carrot', 'Cheese', 'Flour', 'Spices'],
        amount: 10,
        unit: 'pcs'
    },
    {
        id: '3',
        name: 'Buff Momo',
        description: 'Flavorful buffalo meat momos, a traditional delicacy.',
        price: 13.99,
        category: 'Buff',
        image: 'https://images.unsplash.com/photo-1694850184798-320a8e10bb5e?q=80&w=2040&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.9,
        reviewCount: 200,
        ingredients: ['Minced Buff', 'Onion', 'Scallions', 'Ginger', 'Flour', 'Secret Masala'],
        amount: 10,
        unit: 'pcs'
    },
    {
        id: '4',
        name: 'Pork Momo',
        description: 'Succulent pork momos with a rich savory filling.',
        price: 12.49,
        category: 'Pork',
        image: 'https://images.pexels.com/photos/33670191/pexels-photo-33670191.jpeg',
        rating: 4.7,
        reviewCount: 156,
        ingredients: ['Minced Pork', 'Onion', 'Coriander', 'Fat', 'Flour', 'Spices'],
        amount: 10,
        unit: 'pcs'
    },
    {
        id: '5',
        name: 'Beef Momo',
        description: 'Juicy beef momos steamed to perfection.',
        price: 12.99,
        category: 'Beef',
        image: 'https://images.pexels.com/photos/3926123/pexels-photo-3926123.jpeg',
        rating: 4.5,
        reviewCount: 92,
        ingredients: ['Ground Beef', 'Onion', 'Garlic', 'Cilantro', 'Flour', 'Spices'],
        amount: 10,
        unit: 'pcs'
    },
    {
        id: '6',
        name: 'Momo Sauce (Achar)',
        description: 'Traditional tomato and sesame dipping sauce.',
        price: 5.99,
        category: 'Sauce',
        image: 'https://images.unsplash.com/photo-1611516081814-55d97d5a7488?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.8,
        reviewCount: 45,
        ingredients: ['Tomato', 'Sesame Seeds', 'Timur (Sichuan Pepper)', 'Chili', 'Coriander'],
        amount: 1,
        unit: 'jar'
    },
    {
        id: '7',
        name: 'Momo Hot Sauce',
        description: 'Extra spicy chili paste for those who love heat.',
        price: 6.99,
        category: 'Sauce',
        image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.9,
        reviewCount: 60,
        ingredients: ['Red Dry Chili', 'Garlic', 'Oil', 'Salt', 'Lemon'],
        amount: 1,
        unit: 'jar'
    },
    {
        id: '8',
        name: 'Momo Jhol',
        description: 'Spicy and tangy sesame soup base.',
        price: 7.99,
        category: 'Sauce',
        image: 'https://images.unsplash.com/photo-1726082788670-c60006875dfd?q=80&w=1438&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        rating: 4.7,
        reviewCount: 34,
        ingredients: ['Tomato', 'Sesame', 'Peanuts', 'Chili', 'Hog Plum'],
        amount: 1,
        unit: 'container'
    },
    {
        id: '9',
        name: 'Chicken Wings',
        description: 'Crispy fried chicken wings with a Himalayan twist.',
        price: 12.49,
        category: 'Chicken',
        image: 'https://images.pexels.com/photos/29908653/pexels-photo-29908653.jpeg',
        rating: 4.4,
        reviewCount: 28,
        ingredients: ['Chicken Wings', 'Flour', 'Egg', 'Spices', 'Oil'],
        amount: 6,
        unit: 'pcs'
    },
    {
        id: '10',
        name: 'Drums of Heaven',
        description: 'Spicy, tangy chicken lollipops.',
        price: 12.49,
        category: 'Chicken',
        image: 'https://images.pexels.com/photos/9609836/pexels-photo-9609836.jpeg',
        rating: 4.8,
        reviewCount: 56,
        ingredients: ['Chicken Wings', 'Ginger', 'Garlic', 'Chili Sauce', 'Soy Sauce'],
        amount: 6,
        unit: 'pcs'
    }
];

// Transform frontend products to match database schema
const products = frontendProducts.map((product: any) => ({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    rating: product.rating,
    reviewCount: product.reviewCount,
    ingredients: product.ingredients,
    amount: product.amount,
    unit: product.unit,
    featured: ['1', '2', '3', '4'].includes(product.id), // Mark first 4 products as featured
    inStock: true
}));

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️ Cleared existing products');

        // Insert new products
        await Product.insertMany(products);
        console.log('✅ Successfully seeded database with products');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();