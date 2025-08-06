import { axiosInstance } from "../../utils/axios";
import { setBookingDetails, setBookings } from "./booking-slice";

export const fetchBookingDetails = (bookingId) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/rent/user/booking/${bookingId}`
    );
    console.log(response);
    dispatch(setBookingDetails(response.data.data));
  } catch (error) {
    console.error("Error fetching booking details", error);
  }
};

export const fetchUserBookings = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/api/v1/rent/user/booking");
    console.log("API Response: ", response.data);
    dispatch(setBookings(response.data.data.bookings));
  } catch (error) {}
};
