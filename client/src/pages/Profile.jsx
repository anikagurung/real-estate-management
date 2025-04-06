/*import { useState } from "react";
import { useSelector } from "react-redux";
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  deleteUserFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  signOutUserStart, 
  signOutUserFailure 
} from '../redux/user/userSlice.js';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // To navigate when "Add Listing" is clicked

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleAddListing = () => {
    // Redirect to Add Listing page for sellers
    navigate('/add-property');
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font semi-bold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          SignOut
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully' : ''}</p>

      /* Conditionally render Add Listing button for sellers 
      {currentUser.role === 'seller' && (
        <div className="mt-5">
          <button
            onClick={handleAddListing}
            className="bg-green-600 text-white p-3 rounded-lg w-full">
            Add Listing
          </button>
        </div>
      )}
    </div>
  );
}*/
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import VerticalNavbar  from "./VerticalNavbar"; // Import Navbar component

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Fetch user data from the server when the component is mounted
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user/${currentUser._id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        setFormData(data); // Populate form data with the fetched user data
      } catch (err) {
        console.error(err.message);
      }
    };

    if (currentUser?._id) {
      fetchUserData();
    }
  }, [currentUser._id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser.role === "seller" && (!formData.fullname || !formData.contact)) {
      alert("Full Name and Contact are required for sellers.");
      return;
  }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleAddListing = () => {
    navigate("/add-property");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Show VerticalNavbar ONLY if the user has the seller role */}
      {currentUser.role === "seller" && <VerticalNavbar />}

      {/* Profile Content */}
      <div
        className={`p-6 flex-1 bg-white shadow-md ${
          currentUser.role === "seller" ? "flex-1 max-w-lg mx-auto" : "w-full"
        }`}
      >
        <h1 className="text-3xl font semi-bold text-center my-7">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            id="username"
            className="border p-3 rounded-lg"
            defaultValue={formData.username || ""}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            id="email"
            className="border p-3 rounded-lg"
            defaultValue={formData.email || ""}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          {currentUser.role === "seller" && (
  <>
    <input
  type="text"
  placeholder="Full Name"
  id="fullname"
  className="border p-3 rounded-lg"
  defaultValue={formData.fullname || ""}
  onChange={handleChange}
/>

    <input
      type="tel"
      placeholder="Contact Number"
      id="contact"
      className="border p-3 rounded-lg"
      defaultValue={formData.contact || ""}
      onChange={handleChange}
    />
  </>
)}

          <button
            disabled={loading}
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </form>
        <div className="flex justify-between mt-5">
          <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
            Delete Account
          </span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
            SignOut
          </span>
        </div>
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-700 mt-5">
          {updateSuccess ? "User is updated successfully" : ""}
        </p>

        {/* Show Add Listing Button ONLY for Sellers */}
        {currentUser.role === "seller" && (
          <div className="mt-5">
            <button
              onClick={handleAddListing}
              className="bg-green-600 text-white p-3 rounded-lg w-full"
            >
              Add Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

