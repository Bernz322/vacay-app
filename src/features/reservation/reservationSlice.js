import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    reservations: [],
    reservation: {},
    roomReservations: [],
    availability: false,
    isReserveSuccess: false,
    isReserveError: false,
    isReserveLoading: false,
    messageReserve: ""
}

// const API_URL = '/api/reservation'
const API_URL = process.env.NODE_ENV !== 'production' ? `/api/reservation` : `${process.env.REACT_APP_API_ENDPOINT}api/reservation`

export const createReservation = createAsyncThunk('reservation/create', async (reservationData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.post(`${API_URL}`, reservationData, config)
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const checkAvailability = createAsyncThunk('reservation/check', async (reservationDate, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/check`, reservationDate)
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const fetchAllReservationByUser = createAsyncThunk('reservation/fetchAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.get(`${API_URL}/reservations`, config)
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const fetchSingleReservation = createAsyncThunk('reservation/fetchOne', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.get(`${API_URL}/${id}`, config)
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const fetchAllRoomReservation = createAsyncThunk('reservation/fetchRoomReservations', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.get(`${API_URL}/room/${id}`, config)
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const editReservation = createAsyncThunk('reservation/editOne', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.put(`${API_URL}`, { reservationId: data.reservation_id, reservation_status: data.action?.toString(), guest_status: data.status?.toString() }, config)
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteReservation = createAsyncThunk('reservation/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const res = await axios.delete(`${API_URL}/${id}`, config)
        return (res.data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})



const reservationSlice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        reservationReset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReservation.pending, (state) => {
                state.isReserveLoading = true
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                state.isReserveLoading = false
                state.isReserveSuccess = true
                state.reservations.push(action.payload[0])
            })
            .addCase(createReservation.rejected, (state, action) => {
                state.isReserveLoading = false
                state.isReserveError = true
                state.messageReserve = action.payload
            })
            .addCase(checkAvailability.pending, (state) => {
                state.isReserveLoading = true
            })
            .addCase(checkAvailability.fulfilled, (state, action) => {
                state.isReserveLoading = false
                state.isReserveSuccess = true
                state.availability = action.payload
            })
            .addCase(checkAvailability.rejected, (state, action) => {
                state.isReserveLoading = false
                state.isReserveError = true
                state.messageReserve = action.payload
            })
            .addCase(fetchAllReservationByUser.pending, (state) => {
                state.isReserveLoading = true
            })
            .addCase(fetchAllReservationByUser.fulfilled, (state, action) => {
                state.isReserveLoading = false
                state.isReserveSuccess = true
                state.reservations = action.payload
            })
            .addCase(fetchAllReservationByUser.rejected, (state, action) => {
                state.isReserveLoading = false
                state.isReserveError = true
                state.messageReserve = action.payload
            })
            .addCase(fetchSingleReservation.pending, (state) => {
                state.isReserveLoading = true
            })
            .addCase(fetchSingleReservation.fulfilled, (state, action) => {
                state.isReserveLoading = false
                state.isReserveSuccess = true
                state.reservation = action.payload
            })
            .addCase(fetchSingleReservation.rejected, (state, action) => {
                state.isReserveLoading = false
                state.isReserveError = true
                state.messageReserve = action.payload
            })
            .addCase(fetchAllRoomReservation.pending, (state) => {
                state.isReserveLoading = true
            })
            .addCase(fetchAllRoomReservation.fulfilled, (state, action) => {
                state.isReserveLoading = false
                state.isReserveSuccess = true
                state.roomReservations = action.payload
            })
            .addCase(fetchAllRoomReservation.rejected, (state, action) => {
                state.isReserveLoading = false
                state.isReserveError = true
                state.messageReserve = action.payload
            })
            .addCase(editReservation.pending, (state) => {
                state.isReserveLoading = true
            })
            .addCase(editReservation.fulfilled, (state, action) => {
                state.isReserveLoading = false
                state.isReserveSuccess = true
                state.reservation = action.payload
            })
            .addCase(editReservation.rejected, (state, action) => {
                state.isReserveLoading = false
                state.isReserveError = true
                state.messageReserve = action.payload
            })
            .addCase(deleteReservation.pending, (state) => {
                state.isReserveLoading = true
            })
            .addCase(deleteReservation.fulfilled, (state, action) => {
                state.isReserveLoading = false
                state.isReserveSuccess = true
                state.reservation = action.payload
            })
            .addCase(deleteReservation.rejected, (state, action) => {
                state.isReserveLoading = false
                state.isReserveError = true
                state.messageReserve = action.payload
            })
    }
})

export const { reservationReset } = reservationSlice.actions
export default reservationSlice.reducer