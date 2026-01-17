import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Mock Data
const products = [
    {
        id: '1',
        name: 'Steamed Chicken Momo',
        description: 'Juicy chicken momos steamed to perfection, served with spicy tomato chutney.',
        price: 12.99,
        category: 'Chicken',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?q=80&w=2070&auto=format&fit=crop',
        featured: true
    },
    {
        id: '2',
        name: 'Veg Paneer Momo',
        description: 'Soft momos stuffed with spiced paneer and seasonal vegetables.',
        price: 11.49,
        category: 'Veg',
        image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=2070&auto=format&fit=crop',
        featured: true
    },
    {
        id: '3',
        name: 'Buff Jhol Momo',
        description: 'Traditional buffalo meat momos served in a tangy and spicy sesame-based soup.',
        price: 13.99,
        category: 'Buff',
        image: 'https://images.unsplash.com/photo-1512484491122-08a8f4675e2b?q=80&w=1974&auto=format&fit=crop',
        featured: false
    },
    {
        id: '4',
        name: 'Fried Pork Momo',
        description: 'Crispy deep-fried pork momos that are bursting with flavor.',
        price: 12.49,
        category: 'Pork',
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=2070&auto=format&fit=crop',
        featured: false
    }
];

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.post('/api/orders', (req, res) => {
    const { cart, total, user } = req.body;
    console.log('Order received:', { cart, total, user });
    res.status(201).json({ message: 'Order created successfully', orderId: Math.random().toString(36).substr(2, 9) });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
