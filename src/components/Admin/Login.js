import React, { useState } from "react";
import "./Login.css"; // Ensure to style the modal as needed

const Login = ({ onClose }) => {
  const [isLoginSelected, setIsLoginSelected] = useState(true); // Toggle between login and signup forms

  const handleSwitch = (isLogin) => {
    setIsLoginSelected(isLogin);
  };

  return (
    <div className="user-modal is-visible">
      <div className="user-modal-container">
        <ul className="switcher">
          <li>
            <a
              href="#0"
              onClick={() => handleSwitch(true)}
              className={isLoginSelected ? "selected" : ""}
            >
              Login
            </a>
          </li>
          <li>
            <a
              href="#0"
              onClick={() => handleSwitch(false)}
              className={!isLoginSelected ? "selected" : ""}
            >
              Register
            </a>
          </li>
        </ul>

        {/* Login Form */}
        {isLoginSelected && (
          <div id="login" className="form is-selected">
            <form className="form">
              <p className="fieldset">
                <label className="image-replace username" htmlFor="signin-username">
                  Username
                </label>
                <input
                  className="full-width has-padding has-border"
                  type="text"
                  placeholder="Username"
                />
              </p>
              <p className="fieldset">
                <label className="image-replace password" htmlFor="signin-password">
                  Password
                </label>
                <input
                  className="full-width has-padding has-border"
                  type="password"
                  placeholder="Password"
                />
              </p>
              <p className="fieldset">
                <input className="full-width" type="submit" value="Login" />
              </p>
            </form>
          </div>
        )}

        {/* Register Form */}
        {!isLoginSelected && (
          <div id="signup" className="form is-selected">
            <form className="form">
              <p className="fieldset">
                <label className="image-replace username" htmlFor="signup-username">
                  Username
                </label>
                <input
                  className="full-width has-padding has-border"
                  type="text"
                  placeholder="Username"
                />
              </p>
              <p className="fieldset">
                <label className="image-replace email" htmlFor="signup-email">
                  Email
                </label>
                <input
                  className="full-width has-padding has-border"
                  type="email"
                  placeholder="Email"
                />
              </p>
              <p className="fieldset">
                <label className="image-replace password" htmlFor="signup-password">
                  Password
                </label>
                <input
                  className="full-width has-padding has-border"
                  type="password"
                  placeholder="Password"
                />
              </p>
              <p className="fieldset">
                <input className="full-width" type="submit" value="Register" />
              </p>
            </form>
          </div>
        )}
        {/* Close Modal Button */}
        <p className="close-form" onClick={onClose}>
          Close
        </p>
      </div>
    </div>
  );
};

export default Login;
