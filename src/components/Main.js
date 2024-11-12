import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import Login from "./Admin/Login"; // Import the Login modal component

const Main = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const navigate = useNavigate(); 

  const handleNavigation = (page) => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/${page}`); // navigate to the respective route
      setIsAnimating(false);
    }, 1000); // animation delay of 1 second
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal); // Toggle modal visibility
  };

  return (
    <div className="app">
      <div className={`page__style home ${isAnimating ? "animate_content" : ""}`}>
        <div className="page__description">
          <h1 className="heading">Welcome To BlogPage</h1>
          <div>
            <button className="btn_nav" onClick={toggleLoginModal}>
              Login
            </button>
            <button className="btn_nav" onClick={() => handleNavigation("dashboard")}>
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Render Login Modal based on state */}
      {showLoginModal && <Login onClose={toggleLoginModal} />}
    </div>
  );
};

export default Main;
