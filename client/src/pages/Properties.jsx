import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa"; // Import icons

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch property data from API
    fetch("/api/properties")
      .then((response) => response.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">Loading properties...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800">Explore Our Properties</h1>
      <p className="text-lg text-gray-600 text-center mt-2">
        Discover your perfect home from our exclusive listings.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {properties.map((property) => (
          <div
            key={property._id} // Use _id instead of id
            className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300"
          >
            <img
              className="w-full h-48 object-cover"
              src={`http://localhost:3000${property.imageUrls[0]}`}// Fallback image if no image is present
              alt={property.title}
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
             
              <div className="flex space-x-2 text-black mt-4">
                <div className="flex items-center space-x-1">
                  <FaBed />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaBath />
                  <span>{property.bathrooms} Baths</span>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <FaMapMarkerAlt />
                <span>{property.address}</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-2">Rs.{property.price}</p>
              <Link
                to={`/property/${property._id}`} // Use _id in the URL
                className="block mt-4 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;
