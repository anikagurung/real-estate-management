// admin.route.js
import express from 'express';
import { verifyToken, verifyRole } from '../utils/verifyUser.js';

const router = express.Router();

// Admin dashboard
router.get('/dashboard', verifyToken, verifyRole(['admin']), (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard.' });
});

// Other admin-specific routes can go here
router.get('/manage-users', verifyToken, verifyRole(['admin']), (req, res) => {
    res.json({ message: 'Admin can manage users here.' });
});

export default router;
