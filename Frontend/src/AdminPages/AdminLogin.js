import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 
  const { login } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    // Use the login function from auth context
    const result = await login(email, password, true);
    
    if (!result.success) {
      throw new Error(result.message || "Login failed");
    }

    localStorage.setItem("adminEmail", email);

    // Redirect based on role
    if (result.role === "admin") {
      navigate("/admin/dashboard");
    } else if (result.role === "subadmin") {
      navigate("/admin/onlyblogreview");
    } else {
      throw new Error("Unauthorized access");
    }
  } catch (error) {
    setError(error.message === "Failed to fetch" 
      ? "Cannot connect to server. Please try again later." 
      : error.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f7f9] p-4 font-sans">
      
      {/* Top Logo and Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <svg className="w-6 h-6 text-[#002a32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
          </svg>
          <span className="text-2xl font-serif font-bold text-[#002a32] tracking-tight">LexScripta</span>
        </div>
        <span className="text-[10px] font-extrabold text-[#7c8b96] uppercase tracking-[0.15em] font-sans">
          Administrative Access
        </span>
      </div>

      {/* Main Login Card */}
      <div className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200/80 w-full max-w-[420px]">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold font-serif text-[#002a32] tracking-tight mb-2">
            Admin Portal
          </h2>
          <div className="w-8 h-1 bg-[#8c6d23] mx-auto rounded-full"></div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-bold text-sm">
                @
              </span>
              <input
                type="email"
                className="block w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] transition-colors"
                placeholder="admin@lexscripta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition">
                Forgot?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </span>
              <input
                type="password"
                className="block w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="flex gap-3 bg-gray-50/80 border border-gray-100 rounded-lg p-3 text-left">
            <span className="text-[#8c6d23] flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            </span>
            <p className="text-[10px] leading-relaxed font-semibold text-gray-500">
              Access is restricted. Dashboard views (Admin vs Sub-Admin) are dynamically allocated based on your registered institutional ID.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#002a32] text-white py-3 px-4 rounded-lg hover:bg-[#003d49] transition duration-300 disabled:opacity-50 font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>{isLoading ? "Authorizing..." : "Authorize Access"}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 space-y-1">
        <p className="text-[10px] font-bold text-gray-400">
          &copy; 2024 LexScripta Legal Publishing. All rights reserved.
        </p>
        <p className="text-[9px] font-semibold text-gray-400/80">
          Professional Modern Editorial Design System
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;