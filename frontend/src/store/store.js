import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./User/user-slice";
import propertySlice from "./Property/property-slice";
import propertyDetailsSlice from "./PropertyDetails/propertyDetails-slice";
import paymentSlice from "./Payment/payment-slice";
import bookingSlice from "./Booking/booking-slice";
import accomodationSlice from "./Accomodation/Accomodation-slice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    properties: propertySlice.reducer,
    propertydetails: propertyDetailsSlice.reducer,
    payment: paymentSlice.reducer,
    booking: bookingSlice.reducer,
    accomodation: accomodationSlice.reducer,
  },
});

export default store;
