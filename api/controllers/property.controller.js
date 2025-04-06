import Property from '../models/property.model.js';

export const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate('seller', 'name email'); // Optional: populate seller details
       
        const propertiesWithDefaults = properties.map(property => ({
          ...property.toObject(),
          image: property.image ? `/uploads/${property.image}` : null,
          coordinates: property.coordinates || { lat: null, lng: null }, // Default if missing
      }));

      res.status(200).json(propertiesWithDefaults);
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to fetch properties', 
            error: error.message 
        });
    }
};
/*export const getPropertyById = async (req, res) => {
    const { id } = req.params;
    try {
        const property = await Property.findById(id).populate('seller', 'name email'); // Optional: populate seller details
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching property', 
            error: error.message 
        });
    }
};*/
export const getPropertyById = async (req, res) => {
    const { id } = req.params;
    try {
      // Populate the 'seller' field with 'name' and 'contact' (if applicable)
      const property = await Property.findById(id).populate('seller', 'fullname contact');
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      const propertyWithDefaults = {
        ...property.toObject(),
        coordinates: property.coordinates || { lat: null, lng: null },
    };
      res.status(200).json(propertyWithDefaults);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching property',
        error: error.message,
      });
    }
  };
  
