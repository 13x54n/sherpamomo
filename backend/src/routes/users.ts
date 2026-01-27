import express, { Request, Response } from 'express';
import User from '../models/User';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

// PUT /api/users/profile - Update user profile
router.put('/profile', async (req: Request, res: Response) => {
    try {
        const { firebaseUid, phone, address, name, email } = req.body;

        const selector = req.user?._id
            ? { _id: req.user._id }
            : firebaseUid
                ? { firebaseUid }
                : phone
                    ? { phone }
                    : null;

        if (!selector) {
            return res.status(400).json({ message: 'User identifier is required' });
        }

        // Find and update user profile
        const user = await User.findOneAndUpdate(
            selector,
            {
                $set: {
                    ...(phone !== undefined && { phone }),
                    ...(address !== undefined && { address }),
                    ...(name && { name }),
                    ...(email && { email })
                }
            },
            {
                new: true, // Return updated document
                upsert: true, // Create if doesn't exist
                runValidators: true
            }
        );

        console.log('📝 Updated user profile:', user._id);

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
                authProvider: user.authProvider,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/profile/:firebaseUid - Get user profile
router.get('/profile/:firebaseUid', async (req: Request, res: Response) => {
    try {
        const { firebaseUid } = req.params;

        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.json({
            id: user._id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address,
            authProvider: user.authProvider,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/me - Get authenticated user profile
router.get('/me', async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.json({
            id: user._id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address,
            authProvider: user.authProvider,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error('Error fetching current user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/stats - Get user statistics (admin only)
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();

        // Recent users (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Users with phone numbers
        const usersWithPhone = await User.countDocuments({
            phone: { $exists: true, $nin: [null, ''] }
        });

        // Users with addresses
        const usersWithAddress = await User.countDocuments({
            address: { $exists: true, $nin: [null, ''] }
        });

        // Users by authentication method
        const firebaseUsers = await User.countDocuments({
            authProvider: 'firebase'
        });
        const phoneUsers = await User.countDocuments({
            authProvider: 'phone'
        });

        // Monthly user growth (last 6 months)
        const monthlyGrowth = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date();
            monthStart.setMonth(monthStart.getMonth() - i, 1);
            monthStart.setHours(0, 0, 0, 0);

            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1, 0);
            monthEnd.setHours(23, 59, 59, 999);

            const count = await User.countDocuments({
                createdAt: { $gte: monthStart, $lte: monthEnd }
            });

            monthlyGrowth.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                users: count
            });
        }

        // Top user locations (if addresses contain city info)
        // This is a simplified version - in production you'd parse addresses better
        const userLocations = await User.aggregate([
            { $match: { address: { $exists: true, $nin: [null, ''] } } },
            { $group: { _id: '$address', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Calculate user growth rate
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), $lt: thirtyDaysAgo }
        });
        const userGrowthRate = lastMonthUsers > 0
            ? ((recentUsers - lastMonthUsers) / lastMonthUsers) * 100
            : 0;

        res.json({
            totalUsers,
            recentUsers,
            activeUsers: totalUsers, // In production, track actual active users
            usersWithPhone,
            usersWithAddress,
            firebaseUsers,
            phoneUsers,
            userGrowthRate: Number(userGrowthRate.toFixed(1)),
            monthlyGrowth,
            topLocations: userLocations.map(loc => ({
                location: loc._id,
                count: loc.count
            }))
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users - Get all users (admin only)
router.get('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const {
            page = '1',
            limit = '20',
            search,
            role
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Build filter query
        const query: any = {};

        if (role && role !== 'all') {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .sort('-createdAt')
            .limit(limitNum)
            .skip(skip)
            .select('name email role phone address createdAt updatedAt')
            .lean();

        const total = await User.countDocuments(query);

        res.json({
            users,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            hasNextPage: pageNum * limitNum < total,
            hasPrevPage: pageNum > 1
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/users/:userId/role - Promote user to admin (admin only)
router.put('/:userId/role', requireAdmin, async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                message: 'Invalid role',
                error: 'Role must be either "user" or "admin"'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        console.log(`👑 User ${user.email} role updated to ${role} by admin ${req.user?.email}`);

        res.json({
            message: `User role updated to ${role}`,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;