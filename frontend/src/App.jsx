import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import PropertyList from "./components/home/PropertyList";
import PropertyListing from "./components/propertyListing/PropertyListing";
import Main from "./components/home/Main";
import Accomodation from "./components/accomodation/Accomodation";
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import Profile from "./components/user/Profile";
import EditProfile from "./components/user/EditProfile";
import MyBookings from "./components/myBookings/MyBookings";
import BookingDetails from "./components/myBookings/BookingDetails";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userActions } from "./store/User/user-slice";
import { currentUser } from "./store/User/user-action";
import { Toaster } from "react-hot-toast";
import AccomodationForm from "./components/accomodation/AccomodationForm";
import ForgetPassword from "./components/user/ForgetPassword";
import ResetPassword from "./components/user/ResetPassword";
import UpdatePassword from "./components/user/UpdatePassword";
import { Payment } from "./components/payment/payment";
import NotFound from "./components/NotFound";

function App() {
  const dispatch = useDispatch();
  const { errors, isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (errors) {
      dispatch(userActions.clearErrors());
    }
  }, [errors, dispatch]);

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Main />} id="main" exact>
        <Route id="home" index element={<PropertyList />} />
        <Route
          path="propertylist/:id"
          id="propertyListing"
          element={<PropertyListing />}
          exact
        />
        {/* Login */}
        <Route id="login" path="login" element={<Login />} />
        <Route id="signup" path="signup" element={<Signup />} />
        <Route id="profile" path="profile" element={<Profile />} />
        <Route
          id="editprofile"
          path="editprofile"
          element={user ? <EditProfile /> : <Navigate to={"/login"} />}
        />
        {/* accomendation */}
        <Route
          id="accomodation"
          path="accomodation"
          element={<Accomodation />}
        />
        <Route
          id="accomodationform"
          path="accomodationform"
          element={<AccomodationForm />}
        />

        <Route
          id="forgotpassword"
          path="user/forgotPassword"
          element={<ForgetPassword />}
        />

        <Route
          id="resetpassword"
          path="user/resetPassword/:token"
          element={<ResetPassword />}
        />

        <Route
          id="updatepassword"
          path="user/updatepassword"
          element={user ? <UpdatePassword /> : <Navigate to={"/login"} />}
        />

        <Route
          id="mybookings"
          path="user/mybookings"
          element={user ? <MyBookings /> : <Navigate to={"/login"} />}
        />
        <Route
          id="bookingdetails"
          path="user/mybookings/:bookingId"
          element={user ? <BookingDetails /> : <Navigate to={"/login"} />}
        />
        <Route
          id="payment"
          path="payment/:propertyId"
          element={user ? <Payment /> : <Navigate to={"/login"} />}
        />
        {/* Catch-all route for 404 Not Found - MUST be the last route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
  return (
    <div className="App">
      {/* <Home /> */}
      <Toaster position="bottom-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
