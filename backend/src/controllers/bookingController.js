import Razorpay from "razorpay";
import { Property } from "../Models/PropertyModel.js";
import crypto from "crypto";
import { Booking } from "../Models/bookingModel.js";
import moment from "moment";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

//Step1. Create a razorpay order(before booking Creation)
const getCheckOutSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "Please login First",
      });
    }
    const { amount, currency, propertyId, fromDate, toDate, guests } = req.body;

    //Validate dates and availibility before creating an order
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        status: "fail",
        message: "Property not found",
      });
    }

    //Check Availibility
    const isBooked = property.currentBookings.some((booking) => {
      return (
        (booking.fromDate <= new Date(fromDate) &&
          new Date(fromDate) <= booking.toDate) ||
        (booking.fromDate <= new Date(toDate) &&
          new Date(toDate) <= booking.fromDate)
      );
    });

    if (isBooked) {
      return res.status(400).json({
        status: "fail",
        message: "Property is already booked for the requested dates",
      });
    }

    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      receipt: `booking_${Date.now()}_${req.user.name}`,
      notes: {
        propertyId,
        propertyName: property.propertyName,
        userId: req.user._id.toString(),
        fromDate,
        toDate,
        guests: guests.toString(),
      },
    };

    console.log(options);
    const order = await razorpay.orders.create(options);
    console.log("orders", order);
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      propertyName: property.name,
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

//Step 2: Verify payment and create Booking
const verifyPaymentAndCreateBooking = async (req, res) => {
  try {
    const { razorpayData, bookingDetails } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      razorpayData;
    //Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("expectedSignature", expectedSignature);
    console.log("razorpay_payment_id", razorpay_payment_id);

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        status: "fail",
        message: "Payment verification failed",
      });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.status !== "captured") {
      return res.status(400).json({
        status: "fail",
        message: "Payment not completed",
      });
    }
    console.log("booking", bookingDetails);

    //Extract booking Details from payment notes or request body
    const { propertyId, fromDate, toDate, guests, totalAmount } =
      bookingDetails;

    const fromDateMoment = moment(fromDate);
    const toDateMoment = moment(toDate);

    const numberOfnights = toDateMoment.diff(fromDateMoment, "days");
    // Create booking with payment details
    const booking = await Booking.create({
      property: propertyId,
      price: totalAmount,
      guests,
      fromDate,
      toDate,
      numberOfnights,
      user: req.user._id,
      paymentStatus: "completed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: new Date(),
    });

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      {
        $push: {
          currentBookings: {
            bookingId: booking._id,
            fromDate,
            toDate,
            userId: req.user._id,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Booking created successfully",
      data: {
        booking,
        paymentId: razorpay_payment_id,
      },
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      status: "fail",
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    console.log("hello");
    const bookings = await Booking.find({ user: req.user._id });
    console.log("bookings", bookings);
    res.status(200).json({
      status: "success",
      data: {
        bookings,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const bookings = await Booking.findById(req.params.bookingId);
    // console.log(bookings);
    res.status(200).json({
      status: "success",
      data: {
        bookings,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};

export {
  getBookingDetails,
  getCheckOutSession,
  getUserBookings,
  verifyPaymentAndCreateBooking,
};
