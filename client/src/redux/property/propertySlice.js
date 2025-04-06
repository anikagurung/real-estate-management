// src/redux/property/propertySlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  properties: [],
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    fetchSellerPropertiesStart: (state) => {
      state.loading = true;
    },
    fetchSellerPropertiesSuccess: (state, action) => {
      state.properties = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchSellerPropertiesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addPropertyStart: (state) => {
      state.loading = true;
    },
    addPropertySuccess: (state, action) => {
      state.properties.push(action.payload); // Add newly added property to the store
      state.loading = false;
      state.error = null;
    },
    addPropertyFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deletePropertySuccess: (state, action) => {
      state.properties = state.properties.filter(
        (property) => property._id !== action.payload
      );
    },
  },
});

export const {
  fetchSellerPropertiesStart,
  fetchSellerPropertiesSuccess,
  fetchSellerPropertiesFailure,
  addPropertyStart,
  addPropertySuccess,
  addPropertyFailure,
  deletePropertySuccess,
} = propertySlice.actions;

export default propertySlice.reducer;

// Add asynchronous action to fetch seller's properties
export const fetchSellerProperties = (sellerId) => async (dispatch) => {
  dispatch(fetchSellerPropertiesStart());
  try {
    const response = await fetch(`/api/properties/seller/${sellerId}`);
    const data = await response.json();
    if (!data.success) {
      dispatch(fetchSellerPropertiesFailure(data.message));
    } else {
      dispatch(fetchSellerPropertiesSuccess(data.properties));
    }
  } catch (error) {
    dispatch(fetchSellerPropertiesFailure(error.message));
  }
};

// Add asynchronous action for adding a property
export const addProperty = (propertyData) => async (dispatch) => {
  dispatch(addPropertyStart());

  // Create a FormData object for sending files
  const formData = new FormData();
  Object.keys(propertyData).forEach((key) => {
    formData.append(key, propertyData[key]);
  });

  try {
    const response = await axios.post('/api/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the backend knows the request contains files
      },
    });

    if (!response.data.success) {
      dispatch(addPropertyFailure(response.data.message));
    } else {
      dispatch(addPropertySuccess(response.data.property)); // Dispatch success with new property
    }
  } catch (error) {
    dispatch(addPropertyFailure(error.message));
  }
};

// Add asynchronous action to delete a property
export const deleteProperty = (propertyId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/properties/${propertyId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) {
      alert('Failed to delete property');
    } else {
      dispatch(deletePropertySuccess(propertyId)); // Remove property from the store
    }
  } catch (error) {
    alert('An error occurred while deleting the property');
  }
};
