import express from 'express';
import User from '../models/User.js';
import ClaimHistory from '../models/ClaimHistory.js';

const router = express.Router();

// Get all users (sorted by total points)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Add new user
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) return res.status(400).json({ message: 'Name is required' });
    
    const existingUser = await User.findOne({ name: name.trim() });
    if (existingUser) return res.status(400).json({ message: 'User with this name already exists' });
    
    const user = new User({
      name: name.trim(),
      totalPoints: 0
    });

    const savedUser = await user.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Claim points for a user
router.post('/:userId/claim', async (req, res) => {
  try {
    const { userId } = req.params;
    const io = req.app.get('io');
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate random points between 1 and 10
    const claimedPoints = Math.floor(Math.random() * 10) + 1;
    
    // Update user's total points
    user.totalPoints += claimedPoints;
    await user.save();

    // Create claim history record
    const claimHistory = new ClaimHistory({
      userId: user._id,
      userName: user.name,
      points: claimedPoints
    });
    await claimHistory.save();

    // Emit real-time updates to all connected clients
    if (io) {
      // Get updated users list
      const updatedUsers = await User.find().sort({ totalPoints: -1 });
      io.emit('usersUpdated', updatedUsers);
      
      // Emit claim event
      io.emit('pointClaimed', {
        user: user,
        claimedPoints: claimedPoints,
        claimHistory: claimHistory
      });
    }

    return res.json({
      user: user,
      claimedPoints: claimedPoints
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error claiming points', error: error.message });
  }
});

export default router; 