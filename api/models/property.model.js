import mongoose from 'mongoose';
const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,

    },
    price: {
        type: Number,
        required: true,
    },
    bathrooms:{
        type:Number,
        required:true,
    },
    bedrooms:{
        type:Number,
        required:true,
    },
    furnished: {
        type:Boolean,
        required: true,
    },
    parking:{
        type:Boolean,
        required: true,
    },
    type:{
        type:String,
        required:true,
    },
    offer:{
        type:Boolean,
        required:true,
    },
    imageUrls:{
        type: Array,
        required:true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true,
    },
    propertyType: {
        type: String,
        required: true,
        enum: ['flat', 'apartment', 'land', 'house'], // Restricted options
    },
    area: {
        type: Number, // Store the property area
        required: true,
    },
    latitude: {
        type: Number,
        required: true, // Make it required since it's essential for the map
    },
    longitude: {
        type: Number,
        required: true, // Make it required
    },
    reviewsCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  
    
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);

export default Property;
