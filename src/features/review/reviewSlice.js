import { showNotification } from "@mantine/notifications";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { Check, X } from "tabler-icons-react";

const initialState = {
    review: {},
    isReviewLoading: false,
    isReviewSuccess: false,
    isReviewError: false,
    messageReview: ''
}

const API_URL = process.env.NODE_ENV !== 'production' ? `/api/review` : `${process.env.REACT_APP_API_ENDPOINT}api/review`

export const createReview = createAsyncThunk('review/create', async (reviewData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const res = await axios.post(`${API_URL}`, reviewData, config)
        showNotification({
            title: 'Listing created!',
            autoClose: 5000,
            color: 'green',
            icon: <Check />
        })
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

export const deleteReview = createAsyncThunk('review/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const res = await axios.post(`${API_URL}/${id}`, config)
        showNotification({
            title: 'Listing created!',
            autoClose: 5000,
            color: 'green',
            icon: <Check />
        })
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

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        reviewReset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReview.pending, (state) => {
                state.isReviewLoading = true
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.isReviewLoading = false
                state.isReviewSuccess = true
                state.review = action.payload
            })
            .addCase(createReview.rejected, (state, action) => {
                state.isReviewLoading = false
                state.isReviewError = true
                state.messageReview = action.payload
            })
    }
})

export const { reviewReset } = reviewSlice.actions
export default reviewSlice.reducer