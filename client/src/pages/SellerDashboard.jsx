import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Modal from "react-modal";
import VerticalNavbar from "./VerticalNavbar";

Modal.setAppElement("#root");

const SellerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await axios.get(
          "http://localhost:3000/api/seller/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setProperties(response.data.properties);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch properties.");
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Open modal for editing
  const handleEditClick = (property) => {
    console.log(`Editing property with ID: ${property._id}`);
    setEditingProperty(property._id);
    setFormData({ ...property });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: name === "furnished" ? (value === "Yes" ? true : false) : value,
    }));
  };
  

const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const token = Cookies.get("access_token");
    const updateFormData = new FormData();
    if (formData.imageUrls) {
      updateFormData.append("keepImages", JSON.stringify(formData.imageUrls));
    }

    // Include new images to add
    if (formData.newImages) {
      Array.from(formData.newImages).forEach((file) => {
        updateFormData.append("images", file); // Backend expects `images`
      });
    }

    // Include other form data fields
    for (const key in formData) {
      if (key !== "imageUrls" && key !== "newImages") {
        updateFormData.append(key, formData[key]);
      }
    }

    const response = await axios.put(
      `http://localhost:3000/api/seller/update/${editingProperty}`,
      updateFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    // Update properties list
    setProperties((prev) =>
      prev.map((prop) =>
        prop._id === editingProperty ? response.data.property : prop
      )
    );
    closeModal();
    alert("Property updated successfully!");
  } catch (error) {
    console.error("Failed to update property:", error.response || error.message);
    alert("Failed to update property. Please try again.");
  }
};
const handleDeleteClick = async (propertyId) => {
  if (!window.confirm("Are you sure you want to delete this property?")) return;

  try {
    const token = Cookies.get("access_token");
    await axios.delete(`http://localhost:3000/api/seller/delete/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    // Update the properties list after deletion
    setProperties((prev) => prev.filter((property) => property._id !== propertyId));
    alert("Property deleted successfully!");
  } catch (error) {
    console.error("Failed to delete property:", error.response || error.message);
    alert("Failed to delete property. Please try again.");
  }
};

  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <VerticalNavbar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

        {properties.length === 0 ? (
          <p className="text-gray-600">No properties added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property._id} className="bg-white shadow-lg rounded-lg p-4">
                <div className="relative">
                  {property.imageUrls[0] && (
                    <img
                      src={`http://localhost:3000${property.imageUrls[0]}`}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{property.title}</h2>
                  <p>{property.address}</p>
                  <p>Price: Rs.{property.price}</p>
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => handleEditClick(property)}
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(property._id)} className="text-red-600 font-semibold hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="bg-white p-10 rounded-lg shadow-lg max-w-xl mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
        >
          <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
          <div className="overflow-y-auto max-h-[70vh] p-4">
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                placeholder="Title"
                className="border p-2 rounded"
              />
            </div>

            {/* Description */}
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Description"
              className="border p-2 rounded"
            />

            {/* Address */}
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2 rounded"
            />

            {/* Price */}
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
            />

            {/* Bedrooms */}
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms || ""}
              onChange={handleChange}
              placeholder="Bedrooms"
              className="border p-2 rounded"
            />

            {/* Bathrooms */}
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms || ""}
              onChange={handleChange}
              placeholder="Bathrooms"
              className="border p-2 rounded"
            />
            <select
             name="furnished" value={formData.furnished ? "Yes" : "No"}
               onChange={handleChange}
               className="border p-2 rounded">
               <option value="">Is it Furnished?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            <select
              name="propertyType"
              value={formData.propertyType || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select Property Type</option>
              <option value="flat">Flat</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
              <option value="house">House</option>
            </select>

            {/* Area */}
            <input
              type="number"
              name="area"
              value={formData.area || ""}
              onChange={handleChange}
              placeholder="Area"
              className="border p-2 rounded"
            />
            <div>
  <h3 className="text-lg font-bold">Current Images</h3>
  <div className="flex flex-wrap gap-2">
    {formData.imageUrls &&
      formData.imageUrls.map((url, index) => (
        <div key={index} className="relative">
          <img
            src={`http://localhost:3000${url}`}
            alt={`Property Image ${index + 1}`}
            className="w-20 h-20 object-cover rounded border"
          />
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                imageUrls: prev.imageUrls.filter((_, i) => i !== index),
              }))
            }
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1 text-sm"
          >
            ✕
          </button>
        </div>
      ))}
  </div>
</div>

<div>
  <h3 className="text-lg font-bold">Add New Images</h3>
  <input
    type="file"
    name="newImages"
    multiple
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        newImages: e.target.files, // Add new images separately
      }))
    }
    className="border p-2 rounded"/>
</div>     
            <div className="flex justify-end gap-4 mt-4 border-t pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default SellerDashboard;

