import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import Cookies from 'js-cookie';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      const { _id, username, email, role, token } = data;
  
      if (token) {
        Cookies.set('access_token', token, { expires: 1, secure: true, sameSite: 'None' });
        localStorage.setItem('user', JSON.stringify({ _id, username, email, role }));
        dispatch(signInSuccess({ _id, username, email, role, token }));
  
       
        if (role === 'admin') {
         navigate('/admin-dashboard');

        } else if (role === 'seller') {
          navigate('/seller-dashboard');
        } else if (role === 'buyer') {
          navigate('/');
        } else {
          navigate('/'); 
        }
      } else {
        dispatch(signInFailure('No token received'));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };*/
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        if (data.message === 'Email not verified') {
          alert('Please verify your email before logging in.');
        }
        return;
      }
      const { _id, username, email, role, token } = data;
  
      if (token) {
        Cookies.set('access_token', token, { expires: 1, secure: true, sameSite: 'None' });
        localStorage.setItem('user', JSON.stringify({ _id, username, email, role }));
        dispatch(signInSuccess({ _id, username, email, role, token }));
  
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'seller') {
          navigate('/seller-dashboard');
        } else if (role === 'buyer') {
          navigate('/');
        } else {
          navigate('/');
        }
      } else {
        dispatch(signInFailure('No token received'));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  
  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}

