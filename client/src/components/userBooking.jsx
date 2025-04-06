import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const userBooking = (propertyId, appointmentDate, appointmentTime) => {
  const token = Cookies.get('access_token');
  const decoded = token ? jwt_decode(token) : null;
  const userId = decoded ? decoded.id : null;

  const handleBooking = () => {
    if (!userId) {
      alert('Please log in to book an appointment.');
      return;
    }

    // Combine date and time
    const selectedDate = new Date(appointmentDate);
    const [hours, minutes] = appointmentTime.split(':').map(Number);
    selectedDate.setHours(hours);
    selectedDate.setMinutes(minutes);
    selectedDate.setSeconds(0);

    // Convert to UTC before sending
    //const utcDateTime = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString();
    const appointmentDateTime = selectedDate.toISOString(); 

    fetch('http://localhost:3000/api/bookings/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        propertyId,
        userId,
        appointmentDate: appointmentDateTime, // Send as UTC
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert('Booking request sent successfully.');
        } else {
          alert('Failed to create booking.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while booking.');
      });
  };

  return { handleBooking };
};

export default userBooking;
