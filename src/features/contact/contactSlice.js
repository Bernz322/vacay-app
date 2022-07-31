import { showNotification } from "@mantine/notifications";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { Check, X } from "tabler-icons-react";

const initialState = {
    message: '',
    isContactLoading: false,
    isContactSuccess: false,
    isContactError: false,
}

// const API_URL = '/api/contact'
const API_URL = process.env.NODE_ENV !== 'production' ? `/api/contact` : `${process.env.REACT_APP_API_ENDPOINT}api/contact`

export const sendContactMessage = createAsyncThunk('contact/send', async (messageData, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/send`, messageData)
        if (res.data) {
            showNotification({
                title: 'Message sent!',
                message: 'Thank you for your feedback.',
                autoClose: 5000,
                color: 'green',
                icon: <Check />
            })
        }
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        showNotification({
            title: 'Something went wrong. Message not send. Try again',
            message: message,
            autoClose: 5000,
            color: 'red',
            icon: <X />
        })
        return thunkAPI.rejectWithValue(message)
    }
})

export const contactSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendContactMessage.pending, (state) => {
                state.isContactLoading = true
            })
            .addCase(sendContactMessage.fulfilled, (state, action) => {
                state.isContactLoading = false
                state.isContactSuccess = true
                state.message = action.payload
            })
            .addCase(sendContactMessage.rejected, (state, action) => {
                state.isContactLoading = false
                state.isContactError = true
                state.message = action.payload
            })
    }
})
export default contactSlice.reducer