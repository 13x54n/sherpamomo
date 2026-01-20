import express, { Request, Response } from 'express';
import User from '../models/User';

const router = express.Router();

// PUT /api/users/profile - Update user profile
router.put('/profile', async (req: Request, res: Response) => {
    try {
        const { firebaseUid, phone, address, name, email } = req.body;

        if (!firebaseUid) {
            return res.status(400).json({ message: 'Firebase UID is required' });
        }

        // Find and update user profile
        const user = await User.findOneAndUpdate(
            { firebaseUid },
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
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/users/stats - Get user statistics (admin only)
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        });

        res.json({
            totalUsers,
            recentUsers,
            activeUsers: totalUsers // Placeholder - in production, track active users
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;