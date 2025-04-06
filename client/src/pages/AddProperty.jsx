import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import VerticalNavbar from './VerticalNavbar';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function AddProperty() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]); 
  const [markerPosition, setMarkerPosition] = useState({ lat: 27.7172, lng: 85.3240 });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    propertyType: '', 
    area: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sale: false,
    rent: false,
    parking: false,
    furnished: false,
    offer: false,
    latitude: '',
    longitude: '',
  });
  const navigate = useNavigate();

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng);
        setFormData({ 
          ...formData, 
          latitude: e.latlng.lat.toFixed(6), 
          longitude: e.latlng.lng.toFixed(6) 
        }); 
      },
    });
    return <Marker position={markerPosition} />;
  };
  

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setFiles(selectedFiles);

    
    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
  if (name === "sale" && checked) {
    setFormData({
      ...formData,
      sale: true,
      rent: false, 
    });
  } else if (name === "rent" && checked) {
    setFormData({
      ...formData,
      rent: true,
      sale: false, 
    });
  } else {
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('access_token');
    console.log('Token:', token); 
    if (!token) {
      alert('You must log in to add a property.');
      return;
    }

    if (files.length === 0) {
      alert('Please select at least one image to upload.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) {
        alert('Each file must be less than 5MB.');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(files[i].type)) {
        alert('Only JPG and PNG formats are allowed.');
        return;
      }
    }

    const data = new FormData();
    data.append('title', formData.name);
    data.append('description', formData.description);
    data.append('propertyType', formData.propertyType);
    data.append('area', formData.area);
    data.append('address', formData.address);
    data.append('price', formData.price);
    data.append('bedrooms', formData.bedrooms);
    data.append('bathrooms', formData.bathrooms);
    data.append('type', formData.sale ? 'sale' : formData.rent ? 'rent' : '');
    data.append('parking', formData.parking);
    data.append('furnished', formData.furnished);
    data.append('offer', formData.offer);
    data.append('latitude', formData.latitude);
    data.append('longitude', formData.longitude);

    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/seller/add-property',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${Cookies.get('access_token')}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        alert('Property added successfully!');
        setFormData({
          name: '',
          description: '',
          propertyType:'',
          area:'',
          address: '',
          price: '',
          bedrooms: '',
          bathrooms: '',
          sale: false,
          rent: false,
          parking: false,
          furnished: false,
          offer: false,
        });
        setFiles([]);
        setPreviews([]);
        document.getElementById('images').value = null; 
        navigate('/seller-dashboard');
      }
    } catch (error) {
      console.error('Error adding property:', error.response?.data || error.message);
      alert('Failed to add property. Please try again.');
    }
  };

  return (
    <div className="flex  min-h-screen bg-gray-100">
      {/* Display VerticalNavbar for sellers */}
      <VerticalNavbar />
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Add a Property</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          {/* Form inputs */}
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <select
    name="propertyType"
    value={formData.propertyType}
    onChange={handleInputChange}
    className="border p-3 rounded-lg"
    required
  >
    <option value="">Select Property Type</option>
    <option value="flat">Flat</option>
    <option value="apartment">Apartment</option>
    <option value="land">Land</option>
    <option value="house">House</option>
  </select>

  {/* Area Input */}
  <input
    type="number"
    name="area"
    placeholder="Property Area (e.g., 1200 sq.ft)"
    className="border p-3 rounded-lg"
    value={formData.area}
    onChange={handleInputChange}
    required
  />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <input
        type="number"
        step="0.000001"
        name="latitude"
        value={formData.latitude}
        placeholder="Latitude"
        onChange={handleInputChange}
        required
      />
      <input
        type="number"
        step="0.000001"
        name="longitude"
        value={formData.longitude}
        placeholder="Longitude"
        onChange={handleInputChange}
        required
      />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="sale"
                className="w-5"
                checked={formData.sale}
                onChange={handleInputChange}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="rent"
                className="w-5"
                checked={formData.rent}
                onChange={handleInputChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="parking"
                className="w-5"
                checked={formData.parking}
                onChange={handleInputChange}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                className="w-5"
                checked={formData.furnished}
                onChange={handleInputChange}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="offer"
                className="w-5"
                checked={formData.offer}
                onChange={handleInputChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bedrooms"
                min="1"
                max="10"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                min="1"
                max="10"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="price"
                min="1"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Price</p>
                <span className="text-xs">(Rs / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              className="p-3 border border-gray-300 rounded w-full"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-24 w-24 object-cover border rounded-md"
              />
            ))}
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">Pin the Property Location on Map:</p>
            <MapContainer
              center={markerPosition}
              zoom={13}
              style={{ height: '300px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
            </div>
           
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Add Property
          </button>
        </div>
      </form>
    
    </main>
    </div>
  );
}

