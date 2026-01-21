import express, { Request, Response } from 'express';
import Order from '../models/Order';
import { authenticateUser, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Generate unique order ID
const generateOrderId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
};

// GET /api/orders/stats - Get order statistics (admin only)
router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
    try {
        const totalOrders = await Order.countDocuments();

        // Order status counts
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
        const preparingOrders = await Order.countDocuments({ status: 'preparing' });
        const readyOrders = await Order.countDocuments({ status: 'ready' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });
        const failedOrders = await Order.countDocuments({ status: 'failed' });

        // Revenue calculations
        const allOrders = await Order.find({}, 'total createdAt').lean();
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

        // Monthly revenue comparison
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const thisMonthRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: thisMonth, $lt: nextMonth } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const lastMonthRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: lastMonth, $lt: thisMonth } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const currentMonthRevenue = thisMonthRevenue[0]?.total || 0;
        const previousMonthRevenue = lastMonthRevenue[0]?.total || 0;

        // Orders delivered today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const deliveredToday = await Order.countDocuments({
            status: 'delivered',
            updatedAt: { $gte: today, $lt: tomorrow }
        });

        // Recent orders list (last 10 orders)
        const recentOrders = await Order.find()
            .sort('-createdAt')
            .limit(10)
            .select('orderId customerInfo total status createdAt updatedAt')
            .lean();

        // Calculate revenue change percentage
        const revenueChange = previousMonthRevenue > 0
            ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
            : 0;

        // Calculate order change (this month vs last month)
        const thisMonthOrders = await Order.countDocuments({
            createdAt: { $gte: thisMonth, $lt: nextMonth }
        });
        const lastMonthOrders = await Order.countDocuments({
            createdAt: { $gte: lastMonth, $lt: thisMonth }
        });
        const orderChange = lastMonthOrders > 0
            ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
            : 0;

        res.json({
            totalOrders,
            totalRevenue: Number(totalRevenue.toFixed(2)),
            revenueChange: Number(revenueChange.toFixed(1)),
            orderChange: Number(orderChange.toFixed(1)),
            deliveredToday,
            orderStats: {
                pending: pendingOrders,
                confirmed: confirmedOrders,
                preparing: preparingOrders,
                ready: readyOrders,
                delivered: deliveredOrders,
                cancelled: cancelledOrders,
                completed: completedOrders,
                failed: failedOrders
            },
            recentOrders: recentOrders.map(order => ({
                id: order._id.toString(),
                orderId: order.orderId,
                customer: order.customerInfo?.name || 'N/A',
                total: Number(order.total.toFixed(2)),
                status: order.status,
                date: order.createdAt,
                updatedAt: order.updatedAt
            }))
        });
    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/orders - Create new order
router.post('/', authenticateUser, async (req: Request, res: Response) => {
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
            userId: req.user!._id,
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

// GET /api/orders/user - Get orders for authenticated user
router.get('/user/orders', authenticateUser, async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Filter orders by authenticated user's ID
        // Also include orders by email for backwards compatibility with existing orders
        const userOrders = await Order.find({
            $or: [
                { userId: req.user._id },
                {
                    userId: { $exists: false },
                    'customerInfo.email': req.user.email
                }
            ]
        })
            .sort('-createdAt')
            .lean();

        res.json(userOrders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/orders - Get all orders with pagination (admin only)
router.get('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const {
            page = '1',
            limit = '20',
            status,
            search,
            dateFrom,
            dateTo
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Build filter query
        const query: any = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { 'customerInfo.name': { $regex: search, $options: 'i' } },
                { 'customerInfo.email': { $regex: search, $options: 'i' } }
            ];
        }

        if (dateFrom || dateTo) {
            query.createdAt = {};
            if (dateFrom) {
                query.createdAt.$gte = new Date(dateFrom as string);
            }
            if (dateTo) {
                query.createdAt.$lte = new Date(dateTo as string);
            }
        }

        const orders = await Order.find(query)
            .sort('-createdAt')
            .limit(limitNum)
            .skip(skip)
            .lean();

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            hasNextPage: pageNum * limitNum < total,
            hasPrevPage: pageNum > 1
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
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

        if (!['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'completed', 'failed'].includes(status)) {
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

// PUT /api/orders/:orderId/cancel - Cancel order (customer)
router.put('/:orderId/cancel', async (req: Request, res: Response) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only allow cancellation for certain statuses
        if (!['pending', 'confirmed', 'preparing'].includes(order.status)) {
            return res.status(400).json({
                message: 'Order cannot be cancelled at this stage'
            });
        }

        // Update order status to cancelled
        order.status = 'cancelled';
        await order.save();

        console.log(`📦 Order ${order.orderId} cancelled by customer`);

        res.json({
            message: 'Order cancelled successfully',
            order: order
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
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