import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo, clearUserInfo } from "../redux/userSlice";
import { FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import {jwtDecode} from "jwt-decode";

const Navbar = () => {
  const [iconActive, setIconActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const logoutFunc = () => {
    dispatch(clearUserInfo());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header>
      <nav className={`bg-gray-800 text-white p-4 ${iconActive ? "nav-active" : ""}`}>
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            <NavLink to={"/"}>Invoice Application</NavLink>
          </h2>
          <div className="hidden md:flex space-x-4">
           
            {!token ? (
              <>
                <NavLink to={"/login"} className="hover:underline">Login</NavLink>
                <NavLink to={"/register"} className="hover:underline">Register</NavLink>
              </>
            ) : (
              <span className="cursor-pointer hover:underline" onClick={logoutFunc}>Logout</span>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIconActive(!iconActive)}>
              {iconActive ? <RxCross1 className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
      {iconActive && (
        <div className="md:hidden bg-gray-700">
          <div className="flex flex-col p-4 space-y-2">
            <NavLink to="/" className="hover:underline" onClick={() => setIconActive(false)}>Home</NavLink>
            <NavLink to="/invoices" className="hover:underline" onClick={() => setIconActive(false)}>Invoices</NavLink>
            <NavLink to="/create-invoice" className="hover:underline" onClick={() => setIconActive(false)}>Create Invoice</NavLink>
            {!token ? (
              <>
                <NavLink to="/login" className="hover:underline" onClick={() => setIconActive(false)}>Login</NavLink>
                <NavLink to="/register" className="hover:underline" onClick={() => setIconActive(false)}>Register</NavLink>
              </>
            ) : (
              <span className="cursor-pointer hover:underline" onClick={() => { logoutFunc(); setIconActive(false); }}>Logout</span>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
