import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sellerProperties: [], // Stores properties of the logged-in seller
    error: null,
    loading: false,
};

const sellerSlice = createSlice({
    name: 'seller',
    initialState,
    reducers: {
        fetchPropertiesStart: (state) => {
            state.loading = true;
        },
        fetchPropertiesSuccess: (state, action) => {
            state.sellerProperties = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchPropertiesFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addPropertyStart: (state) => {
            state.loading = true;
        },
        addPropertySuccess: (state, action) => {
            state.sellerProperties.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        addPropertyFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    fetchPropertiesStart,
    fetchPropertiesSuccess,
    fetchPropertiesFailure,
    addPropertyStart,
    addPropertySuccess,
    addPropertyFailure,
} = sellerSlice.actions;

export default sellerSlice.reducer;
