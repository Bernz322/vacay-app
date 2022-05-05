import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'

// Get User from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

// const API_URL = '/api/auth'
const API_URL = process.env.NODE_ENV !== 'production' ? `/api/auth` : `${process.env.REACT_APP_API_ENDPOINT}api/auth`

// Login User
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/login`, user)
        if (res.data) {
            localStorage.setItem('user', JSON.stringify(res.data))
        }
        return res.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})
// Register User
export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/register`, user)
        if (res.data) {
            localStorage.setItem('user', JSON.stringify(res.data))
        }
        return res.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        console.log(error.response)
        return thunkAPI.rejectWithValue(message)
    }
})

// Logout User
export const logout = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem('user')
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authReset: (state) => {
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, state => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(register.pending, state => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
    }
})

export const { authReset } = authSlice.actions
export default authSlice.reducer