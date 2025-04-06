import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

const Bookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ bookingId: null, newDate: '' });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token || !currentUser) {
          setError('No user logged in');
          setLoading(false);
          return;
        }
        const response = await axios.get(`/api/bookings/bookings/${currentUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch bookings');
        setLoading(false);
      }
    };
    fetchBookings();
  }, [currentUser]);

  const handleReschedule = async (bookingId) => {
    if (!rescheduleData.newDate) return;
    const selectedDateTime = new Date(rescheduleData.newDate);
    const now = new Date();
    if (selectedDateTime <= now) {
      alert('You cannot select a past date and time.');
      return;
    }
    try {
      const token = Cookies.get('access_token');
      await axios.put(
        `/api/bookings/reschedule/${bookingId}`,
        { newDate: rescheduleData.newDate },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, appointmentDate: rescheduleData.newDate } : b))
      );
      setRescheduleData({ bookingId: null, newDate: '' });
      alert('Your appointment has been rescheduled successfully.');
    } catch (err) {
      alert('Failed to reschedule. Try again.');
    }
  };

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading bookings...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-semibold">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="border rounded-lg p-4 bg-white shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">
                {booking.property?.title || 'No Property Title Available'}
              </h2>
              <p className="text-gray-600">
                Address: {booking.property?.address || 'No Address Available'}
              </p>
              <p className="text-gray-600">
                Price: Rs{booking.property?.price || 'N/A'}
              </p>
              <p className="text-gray-600">
                Appointment Date: {booking.appointmentDate ? new Date(booking.appointmentDate).toLocaleString() : 'N/A'}
              </p>
              <p
                className={`font-medium ${
                  booking.status === 'Confirmed'
                    ? 'text-green-600'
                    : booking.status === 'Rejected'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                Status: {booking.status}
              </p>
              {booking.status !== 'Confirmed' && (
                <button
                  onClick={() => setRescheduleData({ bookingId: booking._id, newDate: '' })}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Reschedule
                </button>
              )}
              {rescheduleData.bookingId === booking._id && (
                <div className="mt-2">
                  <input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    value={rescheduleData.newDate}
                    onChange={(e) => setRescheduleData((prev) => ({ ...prev, newDate: e.target.value }))}
                    className="border p-2 rounded-lg w-full"
                  />
                  <button
                    onClick={() => handleReschedule(booking._id)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookings;

/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

const Bookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ bookingId: null, newDate: '' });
  //const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token || !currentUser) {
          setError('No user logged in');
          setLoading(false);
          return;
        }
        const response = await axios.get(`/api/bookings/bookings/${currentUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch bookings');
        setLoading(false);
      }
    };
    fetchBookings();
  }, [currentUser]);

  const handleReschedule = async (bookingId) => {
    if (!rescheduleData.newDate) return;
    const selectedDateTime = new Date(rescheduleData.newDate);
    const now = new Date();
    if (selectedDateTime <= now) {
      alert('You cannot select a past date and time.');
      return;
    }
    try {
      const token = Cookies.get('access_token');
      await axios.put(
        `/api/bookings/reschedule/${bookingId}`,
        { newDate: rescheduleData.newDate },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, appointmentDate: rescheduleData.newDate } : b))
      );
      setRescheduleData({ bookingId: null, newDate: '' });
      alert('Your appointment has been rescheduled successfully.');
      //setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to reschedule. Try again.');
    }
  };

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading bookings...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-semibold">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h1>
      {/*successMessage && <div className="text-green-600 font-semibold mb-4">{successMessage}</div>*
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="border rounded-lg p-4 bg-white shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">{booking.property.title}</h2>
              <p className="text-gray-600">Address: {booking.property.address}</p>
              <p className="text-gray-600">Price: Rs{booking.property.price}</p>
              <p className="text-gray-600">Appointment Date: {new Date(booking.appointmentDate).toLocaleString()}</p>
              <p className={`font-medium ${booking.status === 'Confirmed' ? 'text-green-600' : booking.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>Status: {booking.status}</p>
              {booking.status !== 'Confirmed' && (
                <button onClick={() => setRescheduleData({ bookingId: booking._id, newDate: '' })} className="mt-2 text-blue-500 hover:underline">Reschedule</button>
              )}
              {rescheduleData.bookingId === booking._id && (
                <div className="mt-2">
                  <input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    value={rescheduleData.newDate}
                    onChange={(e) => setRescheduleData((prev) => ({ ...prev, newDate: e.target.value }))}
                    className="border p-2 rounded-lg w-full"
                  />
                  <button onClick={() => handleReschedule(booking._id)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Confirm</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookings;*/






/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';  // Import useSelector to get currentUser from Redux

const Bookings = () => {
  const { currentUser } = useSelector((state) => state.user);  // Get currentUser from Redux state
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = Cookies.get('access_token'); // Get the token from cookies

        if (!token || !currentUser) {
          setError('No user logged in');
          setLoading(false);
          return;
        }

        // Fetch bookings from the backend using the userId from Redux and send token in headers for authorization
        const response = await axios.get(`/api/bookings/bookings/${currentUser._id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token for authorization
          },
          withCredentials: true,
        });

        setBookings(response.data.bookings); // Assuming the API response contains the bookings array
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading bookings...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-semibold">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-700">{booking.property.title}</h2>
              <p className="text-gray-600">Address: {booking.property.address}</p>
              <p className="text-gray-600">Price: Rs{booking.property.price}</p>
              <p className="text-gray-600">
                Appointment Date: {new Date(booking.appointmentDate).toLocaleString()}
              </p>
              <p
                className={`font-medium ${
                  booking.status === 'Confirmed'
                    ? 'text-green-600'
                    : booking.status === 'Rejected'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                Status: {booking.status}
              </p>
              <button
                className="mt-2 text-blue-500 hover:underline"
              >
                Reschedule
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookings;*/
