import express from 'express';
import { createBooking, getBookings, getBookingsBySeller, rescheduleBooking, respondToBooking } from '../controllers/booking.controller.js';
import { verifyRole, verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

//router.post('/bookings', createBooking); // Endpoint to create a booking
//router.get('/bookings/:userId', getBookings); // Endpoint to get user-specific bookings
// Booking creation requires user authentication
router.post('/bookings', verifyToken, createBooking);

// Retrieve bookings for a specific user (user-specific route)
router.get('/bookings/:userId', verifyToken, getBookings);

router.get('/seller/:sellerId', getBookingsBySeller);
router.post('/respond', verifyToken, respondToBooking);
router.put('/reschedule/:bookingId', verifyToken, rescheduleBooking);



export default router;