import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentDetails: {
    checkinDate: null,
    checkoutDate: null,
    totalPrice: 0,
    propertyName: "",
    address: "",
    maximumGuest: 0,
    images: "",
    nights: 0,
  },
  loading: false,
  error: null,
  orderData: null,
  verificationStatus: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentDetails: (state, action) => {
      state.paymentDetails = action.payload;
    },

    getCheckoutRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.orderData = null;
    },
    getCheckoutSuccess: (state, action) => {
      state.loading = false;
      state.orderData = action.payload;
    },
    getVerifyRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getVerifySuccess: (state, action) => {
      state.loading = false;
      state.orderData = action.payload;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const paymentActions = paymentSlice.actions;
export const { setPaymentDetails } = paymentSlice.actions;

export const selectPaymentDetails = (state) => state.payment.paymentDetails;

export const selectPaymentStatus = (state) => ({
  loading: state.payment.loading,
  error: state.payment.error,
  orderData: state.payment.orderData,
  verificationStatus: state.payment.verificationStatus,
});

export default paymentSlice;
