import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    currentUser: {},
    currentProfile:{},
    users: [],
    isUserLoading: false,
    isUserError: false,
    isUserSuccess: false,
    messageUser: ''
}


const API_URL = '/api/user'

export const getAllUsers = createAsyncThunk('user/fetchAll', async (_, thunkAPI) => {
    try {
        const res = await axios.get(API_URL)
        return res.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getMe = createAsyncThunk('user/fetchMe', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.get(`${API_URL}/me`, config)
        return res.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getUser = createAsyncThunk('user/fetchUser', async (id, thunkAPI) => {
    try {
        const res = await axios.get(`${API_URL}/profile/${id}`)
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const addUser = createAsyncThunk('user/addUser', async (userData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.post(API_URL, userData, config)
        return res.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateUser = createAsyncThunk('user/updateUser', async (userData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.put(API_URL, userData, config)
        return res.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteUser = createAsyncThunk('user/deleteUser', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const res = await axios.delete(`${API_URL}/${id}`, config)
        return res.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userReset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.isUserLoading = true
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isUserLoading = false
                state.isUserSuccess = true
                state.users = action.payload
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isUserLoading = false
                state.isUserError = true
                state.message = action.payload
            })
            .addCase(getMe.pending, (state) => {
                state.isUserLoading = true
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isUserLoading = false
                state.isUserSuccess = true
                state.currentUser = action.payload
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isUserLoading = false
                state.isUserError = true
                state.messageUser = action.payload
            })
            .addCase(getUser.pending, (state) => {
                state.isUserLoading = true
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.isUserLoading = false
                state.isUserSuccess = true
                state.currentProfile = action.payload
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isUserLoading = false
                state.isUserError = true
                state.messageUser = action.payload
            })
            .addCase(addUser.pending, (state) => {
                state.isUserLoading = true
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.isUserLoading = false
                state.isUserSuccess = true
                state.users.push(action.payload)
            })
            .addCase(addUser.rejected, (state, action) => {
                state.isUserLoading = false
                state.isUserError = true
                state.messageUser = action.payload
            })
            .addCase(updateUser.pending, (state) => {
                state.isUserLoading = true
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isUserLoading = false
                state.isUserSuccess = true
                state.currentUser = action.payload
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isUserLoading = false
                state.isUserError = true
                state.messageUser = action.payload
            })
            .addCase(deleteUser.pending, (state) => {
                state.isUserLoading = true
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isUserLoading = false
                state.isUserSuccess = true
                state.users = state.users.filter(user => user.id !== action.payload.id)
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isUserLoading = false
                state.isUserError = true
                state.messageUser = action.payload
            })
    }
})

export const { userReset } = userSlice.actions
export default userSlice.reducer