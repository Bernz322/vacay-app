import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from 'react-redux';

import authReducer from './features/auth/authSlice'
import listingReducer from './features/listing/listingSlice'
import reservationReducer from './features/reservation/reservationSlice'
import reviewReducer from './features/review/reviewSlice'
import userReducer from './features/user/userSlice'
import contactReducer from './features/contact/contactSlice'

import App from './App';
import "./index.css"

const store = configureStore({
  reducer: { auth: authReducer, listing: listingReducer, reservation: reservationReducer, review: reviewReducer, user: userReducer, contact: contactReducer }
})

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
