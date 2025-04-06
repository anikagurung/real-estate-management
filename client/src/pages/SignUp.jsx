import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({ role: "buyer" });
  const [otp, setOtp] = useState(""); // For OTP input
  const [otpSent, setOtpSent] = useState(false); // Toggle between signup and OTP views
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id || e.target.name]: e.target.value,
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.message);
        return;
      }

      // Send OTP after successful signup
      const otpRes = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        setLoading(false);
        setError(otpData.message);
        return;
      }

      setOtpSent(true);
      setLoading(false);
      setError(null);
    } catch (error) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.message);
        return;
      }

      // Navigate to another page (e.g., login) after OTP verification
      navigate("/sign-in");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        {otpSent ? "Verify Your Email" : "Sign Up"}
      </h1>
      {!otpSent ? (
        <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
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

          {formData.role === "seller" && (
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
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
          <p className="text-center">
            We've sent an OTP to your email. Please enter it below.
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            className="border p-3 rounded-lg"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}

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
