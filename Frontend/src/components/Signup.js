import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUniversity, FaGraduationCap } from "react-icons/fa";

const Signup = ({ onClose, onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const baseUrl = process.env.REACT_APP_BASE_URL;

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
      const res = await fetch(`${baseUrl}${endpoint}`, {
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
          sessionStorage.setItem('userToken', data.token);
          sessionStorage.setItem('userRole', 'user');
          
          sessionStorage.removeItem('adminToken');
          sessionStorage.removeItem('adminRole');
          
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[420px] p-8 md:p-10 rounded-md shadow-2xl relative border border-gray-100 font-sans animate-fade-in">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="font-serif text-3xl text-[#002a32] font-semibold mb-2 text-center">
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-6 text-center leading-relaxed px-4">
          {isSignIn
            ? "Access your dashboard to manage and publish your legal insights."
            : "Sign up to start contributing and publishing your legal insights."}
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50"
              placeholder="e.g. counsel@legalwritings.com"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              {isSignIn && (
                <a href="/forgotPassword" className="text-xs font-bold text-[#b48e35] hover:text-[#917127] transition-colors">
                  Forgot Password?
                </a>
              )}
            </div>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password (Sign Up Only) */}
          {!isSignIn && (
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#002a32] hover:bg-[#001a1f] text-white px-4 py-3.5 rounded w-full font-bold text-sm tracking-widest uppercase transition-colors shadow-md hover:shadow-lg mt-2"
          >
            {isSignIn ? "SIGN IN" : "SIGN UP"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-150"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR CONTINUE WITH</span>
          <div className="flex-grow border-t border-gray-150"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-250 rounded text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FaUniversity className="text-[#002a32]" size={14} />
            <span>LinkedIn</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-250 rounded text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FaGraduationCap className="text-[#002a32]" size={14} />
            <span>Google</span>
          </button>
        </div>

        {/* Toggle Form Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {isSignIn ? (
              <>
                Don't have an account?{" "}
                <span
                  onClick={toggleForm}
                  className="text-[#002a32] cursor-pointer font-bold hover:underline ml-1"
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={toggleForm}
                  className="text-[#002a32] cursor-pointer font-bold hover:underline ml-1"
                >
                  Sign In
                </span>
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
