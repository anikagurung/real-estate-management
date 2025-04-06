import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
    property: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Property',
          required: true 
        },
    user: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
           required: true
         },
    appointmentDate: { 
        type: Date, 
        required: true
     },
    status: { 
        type: String,
         enum: ['Pending', 'Confirmed', 'Rejected'],
          default: 'Pending' },
    createdAt: {
         type: Date, 
         default: Date.now }
  });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
  
