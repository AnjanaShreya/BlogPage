import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Signup from "./Signup";
import Footer from "../Navbar/Footer";
import ProfileCard from "./ProfileCard";
import Card from "./Card";
import img0 from '../assets/img0.jpg';
import SearchFilter from "./SearchFilter";

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [SearchQuery, setSearchQuery] = useState();

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

  const handleLogin = () => {
    setIsLoggedIn(true); 
    setShowPopup(false); 
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); 
  };

  return (
    <div>
      <section className="h-screen bg-Hero bg-cover font-[Poppins] md:bg-top bg-center">
        <Navbar />
        <div className="flex flex-col justify-center text-center items-center h-3/4">
          <h2 className="text-white text-2xl font-medium">Think. Learn. Share.</h2>
          <h1 className="md:text-5xl text-3xl text-white font-semibold py-5">
            "Your trusted source for legal insights, simplified."
          </h1>
          <div className="text-xl">
            <button
              className="bg-[#002a32d5] text-white px-6 py-2 rounded-full hover:bg-[#002a32]"
              onClick={handleButtonClick}
            >
              Publish Your Blog
            </button>
          </div>
        </div>
      </section>

      {/* Show Signup Popup */}
      {showPopup && <Signup onClose={handleClosePopup} onLogin={handleLogin} />}
      {/* Content Goes here */}
      <SearchFilter />
      <div className="h-auto">
        {/* Blog Short Display */}
        <div className="md:flex md:mx-16 my-8">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
        {/* About Us Section */}
        <div>
          <div style={parallax}>
            <h1 className="text-2xl font-medium text-center h-[500px] my-8 relative">
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 flex items-center justify-center h-full text-white">
                ABOUT US
              </div>
            </h1>
          </div>
        </div>
        {/* Profiles Section */}
        <div className="mb-8">
          <ProfileCard />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const parallax = {
  backgroundImage: `url(${img0})`,
  minHeight: "500px",
  backgroundAttachment: "fixed",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};


export default Dashboard;
