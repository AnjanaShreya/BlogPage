import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ onClose, onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isSignIn && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const endpoint = isSignIn ? "/auth/signin" : "/auth/signup";
    const payload = {
      email: formData.email,
      password: formData.password
    };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        if (isSignIn) {
          onLogin("user");
          navigate("/blogform");
        } else {
          console.log("✅ Signup successful, please login.");
          setIsSignIn(true);
        }
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-5 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 flex justify-center">
          {isSignIn ? "Sign In" : "User Sign Up"}
        </h2>

        <p className="text-sm text-black mb-4 text-center">
          {isSignIn
            ? "Login to publish your blog here."
            : "Create a user account"}
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#002a32d5] focus:border-[#002a32d5]"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#002a32d5] focus:border-[#002a32d5]"
              placeholder="Enter your password"
            />
          </div>

          {!isSignIn && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#002a32d5] focus:border-[#002a32d5]"
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-[#002a32d5] text-white px-4 py-2 rounded-lg w-full"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>

          {isSignIn && (
            <div className="text-center mt-1">
              <a href="/forgotPassword" className="text-[#002a32d5] font-medium hover:underline">
                Forgot Password?
              </a>
            </div>
          )}
        </form>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-center text-gray-500">
            {isSignIn ? (
              <>
                Don't have an account?{" "}
                <span
                  onClick={toggleForm}
                  className="text-[#002a32d5] cursor-pointer font-medium"
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={toggleForm}
                  className="text-[#002a32d5] cursor-pointer font-medium"
                >
                  Sign In
                </span>
              </>
            )}
          </p>
        </div>

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Signup;
