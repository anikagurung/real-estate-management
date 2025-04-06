import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import VerticalNavbar from '../pages/VerticalNavbar';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const token = Cookies.get('access_token'); // Retrieve token from cookies
  const decodedToken = token ? jwt_decode(token) : null;
  const sellerId = decodedToken ? decodedToken.id : 'default_id'; // Use decoded id as sellerId

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:3000/api/bookings/seller/${sellerId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setAppointments(data);
        })
        .catch((error) => {
          console.error('Error fetching appointments:', error);
        });
    } else {
      console.error('No access token found.');
    }
  }, [sellerId, token]);

  const handleResponse = (bookingId, status) => {
    fetch(`http://localhost:3000/api/bookings/respond`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId, status }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update booking status.');
        }
      })
      .then((data) => {
        alert(data.message); // Notify user of the action's result
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === bookingId ? { ...appointment, status } : appointment
          )
        );
      })
      .catch((error) => {
        console.error('Error responding to booking:', error);
      });
  };

  if (appointments.length === 0) {
    return <div>No appointments found.</div>;
  }

  return (
    <div className="flex h-screen">
      <VerticalNavbar />
      <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">Appointments</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Property Title</th>
              <th className="py-2 px-4 border-b">User Email</th>
              <th className="py-2 px-4 border-b">Appointment Date</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="py-2 px-4 border-b">{appointment.property.title}</td>
                <td className="py-2 px-4 border-b">
        {appointment.user && appointment.user.email ? appointment.user.email : 'No Email Available'}
      </td>
                <td className="py-2 px-4 border-b">
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </td>
             <td className="py-2 px-4 border-b">{appointment.status}</td>
                   {/*<td className="py-2 px-4 border-b">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => handleResponse(appointment._id, 'Confirmed')}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleResponse(appointment._id, 'Rejected')}
                  >
                    Reject
                  </button>
            </td>*/}
            <td className="py-2 px-4 border-b">
  {appointment.status === "Pending" ? (
    <>
      <button className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        onClick={() => handleResponse(appointment._id, "Confirmed")}>
        Accept
      </button>
      <button className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => handleResponse(appointment._id, "Rejected")}>
        Reject
      </button>
    </>
  ) : (
    <span className="text-gray-500">No actions available</span>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
