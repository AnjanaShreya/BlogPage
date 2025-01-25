import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from '../assets/Logo.png';
import Button from '../components/Button';
import NavLinks from "./NavLinks";
import Signup from "../components/Signup";

const Navbar = () => {
  const [open, setOpen] = useState(false); // Toggle for mobile menu
  const [showPopup, setShowPopup] = useState(false); // Toggle for popup
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      // If logged in, redirect directly to the blogform page
      window.location.href = "/blogform";
    } else {
      setShowPopup(true); // Show the login/signup popup
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close popup
  };

  const handleLogin = () => {
    setIsLoggedIn(true); // Set logged-in state
    setShowPopup(false); // Close the popup
  };

  return (
    <nav className="bg-[#f3f4f6d7] shadow-md">
      <div className="flex items-center font-medium justify-between px-5 md:px-10">
        {/* Logo Section */}
        <div className="z-50 p-5 flex justify-between w-full md:w-auto">
          <img src={Logo} alt="Logo" className="md:cursor-pointer h-12" />
          {/* Mobile Menu Toggle */}
          <div
            className="text-3xl md:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <ion-icon name={`${open ? "close" : "menu"}`}></ion-icon>
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex uppercase items-center gap-8 font-[Poppins]">
          <li>
            <Link to="/" className="py-7 px-3 hover:text-[#002a32d5] hover:font-bold">
              Home
            </Link>
          </li>
          <NavLinks />
          {/* <li>
            <Link to="/internships" className="py-7 px-3 hover:text-[#002a32d5] hover:font-bold">
              Internships
            </Link>
          </li> */}
          <li>
            <Link to="/contactus" className="py-7 px-3 hover:text-[#002a32d5] hover:font-bold">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Publish Button for Desktop */}
        <div className="hidden md:block">
          <Button onClick={handleButtonClick} />
        </div>

        {/* Mobile Navigation */}
        <ul
          className={`md:hidden fixed bg-[#f3f4f6d7] w-full top-0 overflow-y-auto h-full py-24 pl-4 duration-500 transition-all ${
            open ? "left-0" : "left-[-100%]"
          }`}
        >
          <li>
            <Link to="/" className="py-7 px-3 block hover:text-[#002a32d5] hover:font-bold">
              Home
            </Link>
          </li>
          <NavLinks />
          {/* <Link to="/internships" className="py-7 px-3 block hover:text-[#002a32d5] hover:font-bold">
            Internships
          </Link> */}
          <Link to="/contactus" className="py-7 px-3 block hover:text-[#002a32d5] hover:font-bold">
            Contact Us
          </Link>
          <div className="py-5">
            {/* Publish Button for Mobile */}
            <Button onClick={handleButtonClick} />
          </div>
        </ul>
      </div>

      {/* Sign In/Sign Up Popup */}
      {showPopup && <Signup onClose={handleClosePopup} onLogin={handleLogin} />}
    </nav>
  );
};

export default Navbar;
