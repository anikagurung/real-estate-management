import { model } from 'mongoose';
import Booking from '../models/booking.model.js';
import Property from '../models/property.model.js'; 
import sendEmail from '../utils/sendEmail.js';

export const createBooking = async (req, res) => {
  try {
    const { propertyId, userId, appointmentDate } = req.body;

    // Ensure the date is in the future (including same day but future time)
    const now = new Date(); // Current date and time
    const selectedDateTime = new Date(appointmentDate); // Appointment date and time

    if (selectedDateTime <= now) {
      return res.status(400).json({ error: 'Appointment date and time must be in the future.' });
    }
   /* const now = new Date();
const selectedDateTime = new Date(appointmentDate);

// Convert both times to UTC for proper comparison
const nowUTC = new Date(now.toISOString());
const selectedUTC = new Date(selectedDateTime.toISOString());

if (selectedUTC <= nowUTC) {
  return res.status(400).json({ error: 'Appointment date and time must be in the future.' });
}
*/

    const booking = new Booking({
      property: propertyId,
      user: userId,
      appointmentDate: selectedDateTime,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get bookings for a specific user
export const getBookings = async (req, res) => {
  try {
    // Fetch bookings for the user, and populate 'property' with relevant fields
    const bookings = await Booking.find({ user: req.params.userId })
      .populate('property', 'title address price image') // Include only necessary fields
      .exec();

    // Return bookings to the client
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch bookings', details: error.message });
  }
};


export const getBookingsBySeller = async (req, res) => {
  const { sellerId } = req.params;
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'property',
        match: { seller: sellerId },  // Use 'seller' instead of 'owner' based on your schema
        select: 'title address price',  // Adjust fields as needed
      })
      .populate('user', 'name email')  // Include user information
      .exec();

    const filteredBookings = bookings.filter((booking) => booking.property !== null);  // Remove unrelated bookings
    res.status(200).json(filteredBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};
/*export const respondToBooking = async (req, res) => {
  try {
    const { bookingId, status } = req.body; 
    const booking = await Booking.findById(bookingId)
      .populate({
        path: 'property',
        populate: {
          path: 'seller',
          select: 'email fullname' 
        }
      })
      .populate('user', 'email username'); // Include user details

    if (!booking || !booking.property.seller) {
      return res.status(404).json({ error: 'Booking or seller not found' });
    }

    booking.status = status;
    await booking.save();

    const user = booking.user;
    const seller = booking.property.seller;
    const message = status === 'Confirmed'
      ? `Hello ${user.username}, your appointment for viewing the property has been confirmed by ${seller.fullname}.`
      : `Hello ${user.username}, your appointment for viewing the property was declined by ${seller.fullname}.`;

    // Send email with seller as sender
    const senderEmail = seller.email; // Use seller's email
    await sendEmail(user.email, 'Appointment Status Update', message, senderEmail);

    res.status(200).json({ message: 'Booking status updated and email sent', booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};*/
export const respondToBooking = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    // Ensure valid status values
    if (!["Pending", "Confirmed", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "property",
        populate: {
          path: "seller",
          select: "email fullname",
        },
      })
      .populate("user", "email username");

    if (!booking || !booking.property.seller) {
      return res.status(404).json({ error: "Booking or seller not found" });
    }

    // Prevent status change if already "Confirmed" or "Rejected"
    if (booking.status === "Confirmed" || booking.status === "Rejected") {
      return res.status(400).json({ error: "Booking status cannot be changed once confirmed or rejected." });
    }

    // Update status
    booking.status = status;
    await booking.save();

    const user = booking.user;
    const seller = booking.property.seller;
    const message =
      status === "Confirmed"
        ? `Hello ${user.username}, your appointment has been confirmed by ${seller.fullname}.`
        : `Hello ${user.username}, your appointment was declined by ${seller.fullname}.`;

    // Send email notification
    await sendEmail(user.email, "Appointment Status Update", message, seller.email);

    res.status(200).json({ message: "Booking status updated and email sent", booking });
  } catch (error) {
    res.status(500).json({ error: "Failed to update booking status" });
  }
};

export const rescheduleBooking = async (req, res) => {
  try {
      const { bookingId } = req.params;
      const { newDate } = req.body;

      if (!newDate) {
          return res.status(400).json({ message: 'New appointment date is required.' });
      }

      // Find the booking by ID
      const booking = await Booking.findById(bookingId);

      if (!booking) {
          return res.status(404).json({ message: 'Booking not found.' });
      }

      // Ensure the user requesting reschedule is the one who made the booking
      if (booking.user.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Unauthorized: You can only reschedule your own bookings.' });
      }

      // Update appointment date
      booking.appointmentDate = new Date(newDate);
      await booking.save();

      res.json({ message: 'Appointment rescheduled successfully.', booking });
  } catch (error) {
      console.error('Error rescheduling appointment:', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
