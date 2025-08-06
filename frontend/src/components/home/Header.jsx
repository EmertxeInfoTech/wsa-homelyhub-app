import React from "react";
import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";
import Filter from "./Filter";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/User/user-action";
import toast from "react-hot-toast";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(logout());
    toast.success("User has loggedout successfully");
    navigate("/");
  };

  const refreshFunction = () => {
    dispatch(propertyAction.updateSearchParams({}));
    dispatch(getAllProperties());
  };

  return (
    <>
      <nav className="header row sticky-top ">
        <Link to="/">
          <img
            src="/assets/logo.png"
            alt="logo"
            className="logo"
            onClick={refreshFunction}
          />
        </Link>
        <div className="search_filter">
          <Search />
          <Filter />
        </div>
        {!isAuthenticated && !user && (
          <Link to="/login">
            <span className="material-symbols-outlined web_logo">
              account_circle
            </span>
          </Link>
        )}
        {isAuthenticated && user && (
          <div className="dropdown">
            <span
              className="material-symbols-outlined web_logo dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user.avatar.url && (
                <img
                  src={user.avatar.url}
                  className="user-img rounded-circle w-25 h-25"
                  alt="icon"
                />
              )}
              {!user.avatar.url && "account_circle"}
            </span>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <Link className="dropdown-item" to="/profile">
                  {" "}
                  My Account
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={logoutUser}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};
export default Header;
