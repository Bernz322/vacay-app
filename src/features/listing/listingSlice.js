import { showNotification } from "@mantine/notifications";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { Check, X } from "tabler-icons-react";

const initialState = {
    listings: [],
    listing: {},
    isListingLoading: false,
    isListingSuccess: false,
    isListingError: false,
    messagesListing: ''
}

// const API_URL = '/api/room'
const API_URL = process.env.NODE_ENV !== 'production' ? `/api/room` : `${process.env.REACT_APP_API_ENDPOINT}api/room`

export const fetchListings = createAsyncThunk('listing/fetchAll', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_URL)
        return res.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        showNotification({
            title: 'Something went wrong.',
            message: message,
            autoClose: 5000,
            color: 'red',
            icon: <X />
        })
        return thunkAPI.rejectWithValue(message)
    }
})

export const fetchListingsOfUser = createAsyncThunk('listing/fetchUserListings', async (id, thunkAPI) => {
    try {
        const res = await axios.get(`${API_URL}/user/${id}`)
        return res.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        showNotification({
            title: 'Something went wrong.',
            message: message,
            autoClose: 5000,
            color: 'red',
            icon: <X />
        })
        return thunkAPI.rejectWithValue(message)
    }
})

export const fetchSingleListing = createAsyncThunk('listing/fetchOne', async (id, thunkAPI) => {
    try {
        const res = await axios.get(`${API_URL}/${id}`)
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        showNotification({
            title: 'Something went wrong.',
            message: message,
            autoClose: 5000,
            color: 'red',
            icon: <X />
        })
        return thunkAPI.rejectWithValue(message)
    }
})

export const editSingleListing = createAsyncThunk('listing/editOne', async (data, thunkAPI) => {

    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.put(`${API_URL}`, { roomId: data.room_id, listing_status: data.status.toString() }, config)
        showNotification({
            title: 'Listing updated!',
            autoClose: 5000,
            color: 'green',
            icon: <Check />
        })
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        showNotification({
            title: 'Something went wrong.',
            message: message,
            autoClose: 5000,
            color: 'red',
            icon: <X />
        })
        return thunkAPI.rejectWithValue(message)
    }
})

export const createListing = createAsyncThunk('listing/create', async (listingData, thunkAPI) => {
    const navigate = useNavigate();
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.post(`${API_URL}`, listingData, config)
        if (res.data) {
            localStorage.removeItem("images")
            showNotification({
                title: 'Listing created!',
                autoClose: 5000,
                color: 'green',
                icon: <Check />
            })
        }
        navigate('/listings')
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        showNotification({
            title: 'Something went wrong.',
            message: message,
            autoClose: 5000,
            color: 'red',
            icon: <X />
        })
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteListing = createAsyncThunk('listing/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.delete(`${API_URL}/${id}`, config)
        showNotification({
            title: 'Post deleted',
            message: 'Post deleted successfully',
            autoclose: 4000,
            color: "green"
        })
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        showNotification({
            title: 'Something went wrong.',
            message: message,
            autoClose: 5000,
            color: 'red',
            icon: <X />
        })
        return thunkAPI.rejectWithValue(message)
    }
})

export const listingSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        listingReset: (state) => initialState
    }, extraReducers: (builder) => {
        builder
            .addCase(fetchListings.pending, (state) => {
                state.isListingLoading = true
            })
            .addCase(fetchListings.fulfilled, (state, action) => {
                state.isListingLoading = false
                state.isListingSuccess = true
                state.listings = action.payload
            })
            .addCase(fetchListings.rejected, (state, action) => {
                state.isListingLoading = false
                state.isListingError = true
                state.messagesListing = action.payload
            })
            .addCase(fetchListingsOfUser.pending, (state) => {
                state.isListingLoading = true
            })
            .addCase(fetchListingsOfUser.fulfilled, (state, action) => {
                state.isListingLoading = false
                state.isListingSuccess = true
                state.listings = action.payload
            })
            .addCase(fetchListingsOfUser.rejected, (state, action) => {
                state.isListingLoading = false
                state.isListingError = true
                state.messagesListing = action.payload
            })
            .addCase(fetchSingleListing.pending, (state) => {
                state.isListingLoading = true
            })
            .addCase(fetchSingleListing.fulfilled, (state, action) => {
                state.isListingLoading = false
                state.isListingSuccess = true
                state.listing = action.payload
            })
            .addCase(fetchSingleListing.rejected, (state, action) => {
                state.isListingLoading = false
                state.isListingError = true
                state.messagesListing = action.payload
            })
            .addCase(editSingleListing.pending, (state) => {
                state.isListingLoading = true
            })
            .addCase(editSingleListing.fulfilled, (state, action) => {
                state.isListingLoading = false
                state.isListingSuccess = true
                state.listing = state.listing.id === action.payload.id ? action.payload : state.listing
            })
            .addCase(editSingleListing.rejected, (state, action) => {
                state.isListingLoading = false
                state.isListingError = true
                state.messagesListing = action.payload
            })
            .addCase(createListing.pending, (state) => {
                state.isListingLoading = true
            })
            .addCase(createListing.fulfilled, (state, action) => {
                state.isListingLoading = false
                state.isListingSuccess = true
                state.listings.push(action.payload)
            })
            .addCase(createListing.rejected, (state, action) => {
                state.isListingLoading = false
                state.isListingError = true
                state.messagesListing = action.payload
            })
            .addCase(deleteListing.pending, (state) => {
                state.isListingLoading = true
            })
            .addCase(deleteListing.fulfilled, (state, action) => {
                state.isListingLoading = false
                state.isListingSuccess = true
                state.listings = state.listings.filter(listing => listing.id !== action.payload.id)
            })
            .addCase(deleteListing.rejected, (state, action) => {
                state.isListingLoading = false
                state.isListingError = true
                state.messagesListing = action.payload
            })
    }
})

export const { listingReset } = listingSlice.actions
export default listingSlice.reducer