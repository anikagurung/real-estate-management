import express from 'express';
import { addReview, getPropertyReviews } from '../controllers/review.controller.js';
import { verifyToken, verifyRole } from '../utils/verifyUser.js';


const router = express.Router();

router.post('/add', verifyToken, addReview); // Users can add a review
router.get('/:propertyId', getPropertyReviews); // Get reviews for a property

export default router;
