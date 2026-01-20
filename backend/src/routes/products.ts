import express, { Request, Response } from 'express';
import Product from '../models/Product';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

// GET /api/products - Get all products with optional filtering
router.get('/', async (req: Request, res: Response) => {
    try {
        const {
            category,
            featured,
            search,
            limit = '20',
            page = '1',
            sort = '-createdAt'
        } = req.query;

        const query: any = {};

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by featured
        if (featured === 'true') {
            query.featured = true;
        }

        // Search in name and description
        if (search) {
            query.$text = { $search: search as string };
        }

        const limitNum = parseInt(limit as string);
        const pageNum = parseInt(page as string);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product
            .find(query)
            .sort(sort as string)
            .limit(limitNum)
            .skip(skip)
            .lean();

        const total = await Product.countDocuments(query);

        // Transform products to frontend format
        const transformedProducts = products.map(product => ({
            id: product._id.toString(),
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
            featured: product.featured,
            inStock: product.inStock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));

        res.json({
            products: transformedProducts,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalProducts: total,
                hasNextPage: pageNum * limitNum < total,
                hasPrevPage: pageNum > 1
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/products/categories - Get all unique categories
router.get('/categories', async (req: Request, res: Response) => {
    try {
        const categories = await Product.distinct('category');
        res.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/products/featured - Get featured products
router.get('/featured', async (req: Request, res: Response) => {
    try {
        const featuredProducts = await Product
            .find({ featured: true })
            .sort('-rating')
            .limit(8)
            .lean();

        // Transform products to frontend format
        const transformedProducts = featuredProducts.map(product => ({
            id: product._id.toString(),
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
            featured: product.featured,
            inStock: product.inStock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));

        res.json(transformedProducts);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Transform MongoDB document to frontend format
        const transformedProduct = {
            id: product._id.toString(),
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
            featured: product.featured,
            inStock: product.inStock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };

        res.json(transformedProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/products - Create new product (admin only - in future)
router.post('/', async (req: Request, res: Response) => {
    try {
        const productData = req.body;
        const product = new Product(productData);
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/products/:id - Update product (admin only - in future)
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/products/:id - Delete product (admin only - in future)
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/products/stats - Get product statistics (admin only)
router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
    try {
        const totalProducts = await Product.countDocuments();
        const inStockProducts = await Product.countDocuments({ inStock: true });
        const outOfStockProducts = await Product.countDocuments({ inStock: false });
        const featuredProducts = await Product.countDocuments({ featured: true });

        // Low stock products (less than 10 items)
        const lowStockProducts = await Product.find({
            inStock: true,
            stock: { $lt: 10, $gt: 0 }
        })
        .select('name stock')
        .limit(5)
        .lean();

        // Top rated products
        const topRatedProducts = await Product.find({ inStock: true })
            .sort('-rating')
            .select('name rating reviewCount')
            .limit(5)
            .lean();

        // Products by category
        const categoryStats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalStock: { $sum: '$stock' },
                    averagePrice: { $avg: '$price' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            totalProducts,
            inStockProducts,
            outOfStockProducts,
            featuredProducts,
            lowStockProducts: lowStockProducts.map(p => ({
                name: p.name,
                stock: p.stock
            })),
            topRatedProducts: topRatedProducts.map(p => ({
                name: p.name,
                rating: p.rating,
                reviewCount: p.reviewCount
            })),
            categoryStats
        });
    } catch (error) {
        console.error('Error fetching product stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/products/:id/stock - Update product stock (admin only)
router.put('/:id/stock', requireAdmin, async (req: Request, res: Response) => {
    try {
        const { stock, inStock } = req.body;

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ message: 'Invalid stock value' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                stock,
                inStock: inStock !== undefined ? inStock : stock > 0
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: 'Product stock updated successfully',
            product: {
                id: product._id,
                name: product.name,
                stock: product.stock,
                inStock: product.inStock
            }
        });
    } catch (error) {
        console.error('Error updating product stock:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/products/bulk/stock - Bulk update stock (admin only)
router.put('/bulk/stock', requireAdmin, async (req: Request, res: Response) => {
    try {
        const { updates } = req.body; // Array of { id, stock, inStock }

        if (!Array.isArray(updates)) {
            return res.status(400).json({ message: 'Updates must be an array' });
        }

        const results = [];
        for (const update of updates) {
            const { id, stock, inStock } = update;

            if (typeof stock !== 'number' || stock < 0) {
                continue; // Skip invalid updates
            }

            const product = await Product.findByIdAndUpdate(
                id,
                {
                    stock,
                    inStock: inStock !== undefined ? inStock : stock > 0
                },
                { new: true }
            );

            if (product) {
                results.push({
                    id: product._id,
                    name: product.name,
                    stock: product.stock,
                    inStock: product.inStock
                });
            }
        }

        res.json({
            message: `Updated ${results.length} products`,
            updatedProducts: results
        });
    } catch (error) {
        console.error('Error bulk updating product stock:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;