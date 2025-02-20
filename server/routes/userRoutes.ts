import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// protected route
router.get('/profile', authenticate, (req, res) => {
  res.json({ message: 'User profile data', user: req.user });
});

export default router;
