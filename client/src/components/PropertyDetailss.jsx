import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import userBooking from './userBooking';


const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  

  const token = Cookies.get('access_token'); // or get the token from cookies
  const decoded = token ? jwt_decode(token) : null;
  const userId = decoded ? decoded.id : null;
  const [appointmentDate, setAppointmentDate] = useState(new Date());

  const [appointmentTime, setAppointmentTime] = useState('12:00'); // default time
  const [showTerms, setShowTerms] = useState(false); // Show modal
  const [termsAccepted, setTermsAccepted] = useState(false); // Checkbox for terms


  const { handleBooking } = userBooking(id, appointmentDate, appointmentTime);

  const handleTimeChange = (event) => {
    setAppointmentTime(event.target.value);
  };
  const handleBookingClick = () => {
    setShowTerms(true); // Show terms and conditions before finalizing booking
  };

  const confirmBooking = () => {
    if (termsAccepted) {
      handleBooking();
      setShowTerms(false);
    } else {
      alert('Please accept the terms and conditions to proceed.');
    }
  };



  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching property details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!property) return <div className="text-center mt-10">Property not found</div>;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === property.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? property.imageUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-amber-950 italic text-3xl font-semibold">{property.title}</h2>
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Image Slider */}
        <div className="my-4">
          <div className="relative">
            <img
              src={`http://localhost:3000${property.imageUrls[currentImageIndex]}`}
              alt={`Property ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover rounded-lg"
            />
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
              onClick={prevImage}
            >
              ❮
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
              onClick={nextImage}
            >
              ❯
            </button>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-gray-700 mb-4">{property.description}</p>
          <div className="flex space-x-4 mb-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <FaBed />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaBath />
              <span>{property.bathrooms} Baths</span>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <FaMapMarkerAlt />
            <span className="ml-2">{property.address || "Address not provided"}</span>
          </div>
          <div className="mt-4">
            <p>
              <strong>Property Type:</strong> {property.propertyType}
            </p>
            <p>
              <strong>Property Area:</strong> {property.area} sq.ft
            </p>
            <p>
              <strong>Parking:</strong> {property.parking ? "Yes" : "No"}
            </p>
            <p>
              <strong>Furnished:</strong> {property.furnished ? "Yes" : "No"}
            </p>
          </div>
          <p className="text-lg font-bold mb-4">Price: Rs.{property.price}</p>
          {property.seller && (
            <div className="mt-4">
              <p>
                <strong>Owner:</strong> {property.seller.fullname}
              </p>
              <p>
                <strong>Contact:</strong> {property.seller.contact}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      {property.latitude && property.longitude ? (
        <div className="my-6">
          <h3 className="text-lg font-semibold">Property Location:</h3>
          <MapContainer
            center={[property.latitude, property.longitude]}
            zoom={15}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[property.latitude, property.longitude]}>
              <Popup>{property.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <div className="text-gray-500 text-center my-6">
          Location details not available for this property.
        </div>
      )}
      <div className="mt-6">
       
        <h3>Select Appointment Date and Time:</h3>
        <DatePicker selected={appointmentDate} onChange={(date) => setAppointmentDate(date)} />
        <div className="mt-2">
          <label htmlFor="time">Select Time: </label>
          <input
            type="time"
            id="time"
            value={appointmentTime}
            onChange={handleTimeChange}
            className="border rounded p-2"
          />
        </div>
        <button onClick={handleBookingClick} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          Request visit
        </button>
      </div>
      {showTerms && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-lg font-bold mb-4">Terms and Conditions</h2>
            <p>By booking an appointment, you agree to the following terms:</p>
            <ul className="list-disc list-inside my-4 text-gray-700">
              <li>Your appointment is for a site visit to the property.</li>
              <li>Once your appointment is confirmed, it is expected that you will visit the property at the scheduled time.</li>
              <li>Cancellations or rescheduling should be done at least 24 hours in advance.</li>
              <li>Failure to show up may result in restrictions on future bookings.</li>
            </ul>
            <div className="flex items-center my-4">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="mr-2"
              />
              <label htmlFor="acceptTerms" className="text-sm">
                I have read and agree to the terms and conditions.
              </label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowTerms(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;


