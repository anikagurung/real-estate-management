{/*import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({ role: 'buyer' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id || e.target.name]: e.target.value,
    });
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^(98|97)\d{8}$/; 
    return phoneRegex.test(number);
  };

  const validatePassword = (password) => {
    return password.length >= 8; 
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (formData.role === 'seller' && (!formData.fullname || !formData.contact)) {
    
      alert("Full Name and Contact are required for sellers.");
      return;
    }
    if (!validatePassword(formData.password)) {
      setError(
        'Password must be at least 8 characters long'
      );
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          value={formData.role}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        {formData.role === 'seller' && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              className="border p-3 rounded-lg"
              id="fullname"
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              placeholder="Contact Number"
              className="border p-3 rounded-lg"
              id="contact"
              onChange={handleChange}
              required
            />
          </>
        )}
 
        <button
          disabled={loading}
        className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">  {loading ? 'Loading...' : 'Sign Up'} </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      
      
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}*/}
// signup.jsx (Updated)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({ role: 'buyer' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id || e.target.name]: e.target.value,
    });
  };
  const validatePassword = (password) => {
    return password.length >= 8; 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      // Send OTP for email verification after successful sign-up
      const otpRes = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const otpData = await otpRes.json();

      if (otpData.success) {
        setOtpSent(true);  // Indicate that OTP was sent
        setLoading(false);
        setError(null);
        navigate('/verify-otp');  // Redirect to OTP verification page
      } else {
        setLoading(false);
        setError(otpData.message);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          value={formData.role}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        {formData.role === 'seller' && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              className="border p-3 rounded-lg"
              id="fullname"
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              placeholder="Contact Number"
              className="border p-3 rounded-lg"
              id="contact"
              onChange={handleChange}
              required
            />
          </>
        )}

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      {/* Display OTP input form after successful sign-up 
    {otpSent && (
      <div>
        <h2>Enter OTP to verify your email</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleOtpSubmit}>Verify OTP</button>
      </div>
    )}*/}
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>

      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}



