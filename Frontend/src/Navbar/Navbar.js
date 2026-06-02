import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from '../assets/Logo.png';
import Button from '../components/Button';
import NavLinks from "./NavLinks";
import Signup from "../components/Signup";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false); // Toggle for mobile menu
  const [showPopup, setShowPopup] = useState(false); // Toggle for popup
  const { user, verifySession, logout } = useAuth();
  const isLoggedIn = !!user;
  const location = useLocation();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLoggedIn) {
      window.location.href = "/blogform";
    } else {
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleLogin = async () => {
    await verifySession();
    setShowPopup(false);
  };

  const handleLogout = async () => {
    await logout();
    // Clear storage just in case
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRole');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate("/");
  };

  return (
    <nav className="bg-white z-50">
      <div className="flex items-center font-medium justify-between px-5 md:px-10">
        {/* Logo Section */}
        <div className="z-50 py-4 flex justify-between w-full md:w-auto">
          <Link to="/">
            <img src={Logo} alt="Logo" className="md:cursor-pointer h-10 object-contain" />
          </Link>
          {/* Mobile Menu Toggle */}
          <div
            className="text-3xl md:hidden cursor-pointer flex items-center"
            onClick={() => setOpen(!open)}
          >
            <ion-icon name={`${open ? "close" : "menu"}`}></ion-icon>
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex uppercase items-center gap-8 font-sans text-sm font-semibold tracking-wider text-gray-700">
          <li>
            <Link to="/" className={`py-4 px-2 hover:text-gold transition-colors inline-block relative group ${
              location.pathname === "/" ? "text-gold font-bold" : "text-gray-700"
            }`}>
              Home
              <span className={`absolute bottom-2 left-0 h-0.5 bg-gold transition-all duration-300 ${
                location.pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
          </li>
          <NavLinks />
          <li>
            <Link to="/contactus" className={`py-4 px-2 hover:text-gold transition-colors inline-block relative group ${
              location.pathname === "/contactus" ? "text-gold font-bold" : "text-gray-700"
            }`}>
              Contact Us
              <span className={`absolute bottom-2 left-0 h-0.5 bg-gold transition-all duration-300 ${
                location.pathname === "/contactus" ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
          </li>
        </ul>

        {/* Publish Button for Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Button onClick={handleButtonClick} title="Write" />
              <Button onClick={handleLogout} title="Logout" />
            </div>
          ) : (
            <Button onClick={handleButtonClick} title="Sign In and Write" />
          )}
        </div>

        {/* Mobile Navigation */}
        <ul
          className={`md:hidden fixed bg-white w-full top-0 overflow-y-auto h-full py-24 pl-4 duration-500 transition-all z-40 ${open ? "left-0" : "left-[-100%]"
            }`}
        >
          <li>
            <Link to="/" className={`py-5 px-3 block uppercase font-semibold text-sm tracking-wider ${
              location.pathname === "/" ? "text-gold font-bold" : "text-gray-700 hover:text-gold"
            }`}>
              Home
            </Link>
          </li>
          <NavLinks />
          <li>
            <Link to="/contactus" className={`py-5 px-3 block uppercase font-semibold text-sm tracking-wider ${
              location.pathname === "/contactus" ? "text-gold font-bold" : "text-gray-700 hover:text-gold"
            }`}>
              Contact Us
            </Link>
          </li>
          <div className="py-5 px-3 flex flex-col gap-3">
            {/* Publish Button for Mobile */}
            <Button onClick={handleButtonClick} title={isLoggedIn ? "Write" : "Publish"} />
            {isLoggedIn && (
              <Button onClick={handleLogout} title="Logout" />
            )}
          </div>
        </ul>
      </div>

      {/* Sign In/Sign Up Popup */}
      {showPopup && <Signup onClose={handleClosePopup} onLogin={handleLogin} />}
    </nav>
  );
};

export default Navbar;
