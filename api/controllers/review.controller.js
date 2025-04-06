import Review from '../models/review.model.js';
import Booking from '../models/booking.model.js';
import Property from '../models/property.model.js';

// Check if the user can review (only if they have a confirmed booking)
const canUserReview = async (userId, propertyId) => {
  const currentDate = new Date();

  const booking = await Booking.findOne({
    user: userId,
    property: propertyId,
    status: 'Confirmed',
    visitDate: { $lt: currentDate }, // Only allow if visit date is in the past
  });

  return !!booking; // Returns true if a valid past booking exists
};
// Add a review
export const addReview = async (req, res) => {
    try {
      const { propertyId, rating, comment } = req.body;
      const userId = req.user.id; // Ensure the user is authenticated
  
      // Check if user is eligible to review
      const isEligible = await canUserReview(userId, propertyId);
      if (!isEligible) {
        return res.status(403).json({ error: 'You can only review properties you have visited.' });
      }
  
      // Check if user has already reviewed this property
      const existingReview = await Review.findOne({ user: userId, property: propertyId });
      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this property.' });
      }
  
      // Create new review
      const review = new Review({ property: propertyId, user: userId, rating, comment });
      await review.save();
     // Populate user details before sending response
     const populatedReview = await Review.findById(review._id).populate('user', 'username');
      // Update property's rating safely
      const reviews = await Review.find({ property: propertyId });
  
      const totalReviews = reviews.length;
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  
      // Use `findByIdAndUpdate` to update only the necessary fields
      await Property.findByIdAndUpdate(propertyId, {
        $set: { reviewsCount: totalReviews, averageRating: avgRating }
      }, { new: true, runValidators: false }); // Avoid validation errors
  
      res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: 'Failed to add review' });
    }
  };
  
// Get reviews for a property
export const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const reviews = await Review.find({ property: propertyId }).populate('user', 'username');

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
