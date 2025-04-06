import Property from '../models/property.model.js';
import path from 'path';  // Add this to import the path module
import fs from 'fs';


export const addProperty = async (req, res, next) => {
  try {
    const { title, description, price, propertyType, area, latitude, longitude } = req.body;

    if (!title || !description || !price || !req.files.length || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, price, images, and location are required!',
      });
    }

    if (isNaN(area) || area <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Area must be a positive number.',
      });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be valid numbers.',
      });
    }

    if (req.files.length > 6) {
      return res.status(400).json({ success: false, message: 'You can upload a maximum of 6 images.' });
    }

    // Extract uploaded image URLs
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    // Create new property
    const newProperty = await Property.create({
      ...req.body,
      seller: req.user.id,
      imageUrls,
      latitude,
      longitude, 
    });

    res.status(201).json({
      success: true,
      message: 'Property added successfully!',
      property: newProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerDashboard = async (req, res, next) => {
  try {
    // Get the seller's ID from the verified token (added by the middleware)
    const sellerId = req.user.id;

    // Fetch all properties added by this seller
    const properties = await Property.find({ seller: sellerId });

    // Return the properties in the response
    res.status(200).json({
      success: true,
      message: 'Properties fetched successfully.',
      properties,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

   
    const keepImages = req.body.keepImages ? JSON.parse(req.body.keepImages) : [];
    const deleteImages = req.body.deleteImages ? JSON.parse(req.body.deleteImages) : [];

   
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    
    if (property.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Remove deleted images from the server
    deleteImages.forEach((imagePath) => {
      const fullPath = path.join(process.cwd(), imagePath); // Adjust this path if necessary
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete the file
      }
    });

    // Collect new image URLs
    const newImages = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    // Merge `keepImages` with `newImages`
    const updatedImageUrls = [...keepImages, ...newImages];

    // Prepare the updated fields
    const updatedFields = {
      ...req.body,
      imageUrls: updatedImageUrls,
    };

    // Remove unnecessary fields from the update
    delete updatedFields.keepImages;
    delete updatedFields.deleteImages;

    // Update the property in the database
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Property updated successfully!',
      property: updatedProperty,
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
export const deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

  
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (property.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Remove property images from the server
    /*property.imageUrls.forEach((imagePath) => {
      const fullPath = path.join(process.cwd(), imagePath); // Adjust the path if needed
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete the file
      }
    });*/
    // Remove property images from the server only if they are not used by other properties
    for (const imagePath of property.imageUrls) {
      const fullPath = path.join(process.cwd(), imagePath); // Adjust path if necessary
      
      // Check if the image is used by any other property
      const imageInUse = await Property.exists({ imageUrls: imagePath });
      
      // If the image is not used by any other property, delete it
      if (!imageInUse && fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete the image file from the server
      }
    }
    await Property.findByIdAndDelete(propertyId);
    res.status(200).json({ success: true, message: "Property deleted successfully!" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};