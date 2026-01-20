import express, { Request, Response } from 'express';
import Order from '../models/Order';

const router = express.Router();

// Generate unique order ID
const generateOrderId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
};

// POST /api/orders - Create new order
router.post('/', async (req: Request, res: Response) => {
    try {
        const { items, customerInfo, paymentInfo } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 50 ? 0 : 5.00; // Free shipping over $50
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        const orderData = {
            orderId: generateOrderId(),
            items,
            subtotal,
            tax,
            shipping,
            total,
            customerInfo,
            paymentInfo,
            status: 'pending'
        };

        const order = new Order(orderData);
        await order.save();

        console.log('📦 New order created:', order.orderId);

        res.status(201).json({
            message: 'Order created successfully',
            orderId: order.orderId,
            order: {
                id: order._id,
                orderId: order.orderId,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/orders/:orderId - Get order by order ID
router.get('/:orderId', async (req: Request, res: Response) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }).lean();

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/orders/:orderId/status - Update order status (admin only - in future)
router.put('/:orderId/status', async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/orders - Get all orders with pagination (admin only - in future)
router.get('/', async (req: Request, res: Response) => {
    try {
        const {
            status,
            limit = '20',
            page = '1',
            sort = '-createdAt'
        } = req.query;

        const query: any = {};
        if (status) {
            query.status = status;
        }

        const limitNum = parseInt(limit as string);
        const pageNum = parseInt(page as string);
        const skip = (pageNum - 1) * limitNum;

        const orders = await Order
            .find(query)
            .sort(sort as string)
            .limit(limitNum)
            .skip(skip)
            .lean();

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalOrders: total,
                hasNextPage: pageNum * limitNum < total,
                hasPrevPage: pageNum > 1
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;