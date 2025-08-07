import React, { useEffect } from "react";
import "../../CSS/Payment.css";
import {
  initiateCheckoutSession,
  verifyPayment,
} from "../../store/Payment/payment-action";
import {
  selectPaymentDetails,
  selectPaymentStatus,
} from "../../store/Payment/payment-slice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const {
    checkinDate,
    checkoutDate,
    totalPrice,
    propertyName,
    guests,
    nights,
  } = useSelector(selectPaymentDetails);

  const { loading, error, orderData } = useSelector(selectPaymentStatus);

  const loadRazorPayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    const isLoaded = await loadRazorPayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK");
      return;
    }

    try {
      const paymentData = {
        amount: totalPrice,
        currency: "INR",
        propertyId,
        fromDate: checkinDate,
        toDate: checkoutDate,
        guests,
      };

      // Dispatch and wait for payment initiation
      await dispatch(initiateCheckoutSession(paymentData));

      // Razorpay will open in useEffect once orderData is available
    } catch (error) {
      toast.error("Payment initiation failed");
      console.error("Payment initiation failed", error);
    }
  };

  useEffect(() => {
    if (!orderData || !orderData.orderId || !orderData.keyId) return;

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "HomelyHub",
      description: `Booking for ${propertyName}`,
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          await dispatch(
            verifyPayment({
              razorpayData: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              bookingDetails: {
                propertyId,
                fromDate: checkinDate,
                toDate: checkoutDate,
                guests,
                totalAmount: totalPrice,
              },
            })
          );

          toast.success("Booking confirmed! Redirecting...");
          // Use timeout for smoother transition
          setTimeout(() => navigate("/user/mybookings"), 1000);
        } catch (error) {
          toast.error("Payment verification failed");
          navigate("/");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || "",
      },
      notes: {
        property_id: propertyId,
        property_name: propertyName,
      },
      theme: {
        color: "#FF5A5F",
      },
      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }, [orderData]);

  return (
    <div className="booking-container">
      <div className="property-details">
        <h2>{propertyName}</h2>
        <p>₹{totalPrice}</p>
      </div>

      <div className="booking-form">
        <div className="form-group">
          <label>Check-in Date:</label>
          <input type="date" value={checkinDate} disabled />
        </div>

        <div className="form-group">
          <label>Check-out Date:</label>
          <input type="date" value={checkoutDate} disabled />
        </div>

        <div className="form-group">
          <label>Number of Guests:</label>
          <input type="number" value={guests} disabled />
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Total Amount: ₹{totalPrice}</p>
          <p>Number of Nights: {nights}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          onClick={handleBooking}
          disabled={loading}
          className="book-now-btn"
        >
          {loading ? "Processing..." : `Book Now - ₹${totalPrice}`}
        </button>
      </div>
    </div>
  );
};

export default Payment;
