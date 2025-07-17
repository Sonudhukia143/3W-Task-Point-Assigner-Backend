import express from 'express';
import ClaimHistory from '../models/ClaimHistory.js';

const router = express.Router();

// Get claim history
router.get('/history', async (req, res) => {
  try {
    const history = await ClaimHistory.find()
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 claims for performance
    
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching claim history', error: error.message });
  }
});

// Get claim history for a specific user
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const history = await ClaimHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user claim history', error: error.message });
  }
});

export default router; 