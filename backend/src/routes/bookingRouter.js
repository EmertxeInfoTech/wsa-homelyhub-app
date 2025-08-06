import express from "express";
const bookingRouter = express.Router();
import {
  getCheckOutSession,
  getUserBookings,
  verifyPaymentAndCreateBooking,
  getBookingDetails,
} from "../controllers/bookingController.js";
import { protect } from "../controllers/authController.js";

//Get all bookings made bt the current user
bookingRouter.get("/", protect, getUserBookings);

//Get details of specific booking by booking Id
bookingRouter.get("/:bookingId", protect, getBookingDetails);

//Create a new booking(must be loggedin)
bookingRouter
  .route("/verify-payment")
  .post(protect, verifyPaymentAndCreateBooking);

//Geat a razorpay checkout session (for payments)
bookingRouter.post("/checkout-session", protect, getCheckOutSession);

export { bookingRouter };
