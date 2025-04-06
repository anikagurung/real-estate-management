import express from 'express';
import { deleteUser, updateUser ,getUser, getAllUsers} from '../controllers/user.controller.js';
import { verifyRole, verifyToken } from '../utils/verifyUser.js';
 
const router = express.Router();

router.get('/users',verifyToken, verifyRole(['admin']), getAllUsers);
router.post('/update/:id',verifyToken, updateUser);
router.get("/:id", getUser);
router.delete('/delete/:id',verifyToken, deleteUser);

router.get('/buyer-only', verifyToken, verifyRole(['buyer']), (req, res) => {
    res.json({ message: 'This is buyer-only content.' });
});

router.get('/admin/dashboard', verifyToken, verifyRole(['admin']), (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard.' });
});

export default router;