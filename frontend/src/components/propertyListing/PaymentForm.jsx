import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { DatePicker, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { setPaymentDetails } from "../../store/Payment/payment-slice";

const PaymentForm = ({
  price,
  propertyName,
  address,
  maximumGuest,
  propertyId,
  currentBookings,
}) => {
  const [calculatedPrice, setCalulatedPrice] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const { isAuthenticated } = useSelector((state) => state.user);

  let disabledDates = currentBookings.map((dates) => ({
    start: new Date(dates.fromDate),
    end: new Date(new Date(dates.toDate).setHours(23, 59, 59, 999)),
  }));

  const isDateDisabled = (current) => {
    return (
      current.isBefore(moment(), "day") ||
      disabledDates.some(
        ({ start, end }) => current.toDate() >= start && current.toDate() <= end
      )
    );
  };

  const form = useForm({
    defaultValues: {
      dateRange: [],
      guests: "",
      name: "",
      phoneNumber: "",
    },
    onSubmit: async ({ value }) => {
      const [checkinDate, checkoutDate] = value.dateRange;
      const nights = moment(checkoutDate).diff(moment(checkinDate), "days");
      const { name, guests, phoneNumber } = value;
      if (name && guests && phoneNumber && checkinDate && checkoutDate) {
        await dispatch(
          setPaymentDetails({
            checkinDate,
            checkoutDate,
            nights,
            totalPrice: calculatedPrice,
            propertyName,
            address,
            guests,
          })
        );
        navigate(`/payment/${propertyId}`);
      } else {
        alert("Please fill all fields correctly before proceeding.");
      }
    },
  });

  return (
    <div className="form-container">
      <form
        className="payment-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="price-pernight">
          Price: <b>&#8377;{price}</b>
          <span> / Per night</span>
        </div>
        <div className="payment-field">
          <form.Field name="dateRange">
            {(field) => (
              <div className="date">
                <Space direction="vertical" size={12}>
                  <RangePicker
                    format="YYYY-MM-DD"
                    picker="date"
                    disabledDate={isDateDisabled}
                    onChange={(value, dateString) => {
                      field.handleChange(dateString);
                      const [checkin, checkout] = dateString;
                      if (checkin && checkout) {
                        const nights = moment(checkout, "YYYY-MM-DD").diff(
                          moment(checkin, "YYYY-MM-DD"),
                          "days"
                        );
                        const total = price * nights;
                        setCalulatedPrice(total); // ✅ immediately update
                      } else {
                        setCalulatedPrice(0); // Reset if dates are incomplete
                      }
                    }}
                  />
                </Space>
              </div>
            )}
          </form.Field>
          <form.Field
            name="guests"
            validators={{
              onChange: ({ value }) =>
                value > 0 && value <= maximumGuest
                  ? undefined
                  : `Guests must be 1 - ${maximumGuest}`,
            }}
          >
            {(field) => (
              <div className="guest">
                <label className="payment-labels">Number of guests:</label>
                <br></br>
                <input
                  type="number"
                  className="no-of-guest"
                  placeholder="Guest"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                ></input>
                {field.state.meta.errors && (
                  <p style={{ color: "red" }}>{field.state.meta.errors}</p>
                )}
              </div>
            )}
          </form.Field>
          <div className="name-phoneno">
            <form.Field name="name">
              {(field) => (
                <>
                  <label className="payment-labels">Your full name:</label>{" "}
                  <br></br>
                  <input
                    type="text"
                    className="full-name"
                    placeholder="Name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></input>
                </>
              )}
            </form.Field>
            <br></br>
            <form.Field name="phoneNumber">
              {(field) => (
                <>
                  <label className="payment-labels">Phone Number:</label>{" "}
                  <br></br>
                  <input
                    type="number"
                    className="phone-number"
                    placeholder="Number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></input>
                </>
              )}
            </form.Field>
          </div>
        </div>
        <div className="book-place">
          {!isAuthenticated ? (
            <button>
              <Link
                to={"/login"}
                style={{ textDecoration: "none", color: "white" }}
              >
                Login to Book
              </Link>
            </button>
          ) : (
            <button>Book this place &#8377; {calculatedPrice}</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
