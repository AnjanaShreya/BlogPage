import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../Navbar/Navbar";
import Signup from "../components/Signup";
import Footer from "../Navbar/Footer";
import ProfileCard from "../components/ProfileCard";
import Card from "../components/Card";
import img0 from '../assets/img0.jpg';
import Button from "../components/Button";

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery] = useState("");
  
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate("/blogform");
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

  // const handleSearch = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  // Redirect to All Blogs when "See More" is clicked
  const handleSeeMore = () => {
    navigate("/allblogs");
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
      
      {/* Search Bar */}
      {/* <SearchFilter handleSearch={handleSearch} /> */}
      
      <div className="h-auto">
        {/* Blog Short Display */}
        <div className="my-8">
          <Card className="md:flex md:mx-9" searchQuery={searchQuery} limit={8} />
          <div className="flex justify-center mt-5">
            <Button onClick={handleSeeMore} title="See More" />
          </div>
        </div>


        {/* About Us Section */}
        <div>
          <div style={parallax}>
            <h1 className="text-2xl font-medium text-center h-[500px] my-8 relative">
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 flex items-center justify-center h-full text-white">
                <div>
                  ABOUT US
                  <p className="text-base md:px-32 md:pt-5">
                    A law blog page that serves as a hub for legal insights, discussions, and updates while also offering various programs to engage aspiring legal professionals. Along with well-researched articles on contemporary legal issues, case analyses, and legislative updates, the platform hosts moot court competitions, allowing students to refine their advocacy skills. Additionally, it provides summer and winter programs featuring internships, research projects, and skill-building workshops. Panel discussions with legal experts, judges, and academics further enhance learning by fostering critical debates on pressing legal matters. This multi-faceted approach creates a dynamic space for law enthusiasts to gain knowledge, network, and develop practical skills.
                  </p>
                </div>
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
