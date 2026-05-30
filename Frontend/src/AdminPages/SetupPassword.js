import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SetupPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!email || !token) {
      setError("Invalid or incomplete registration link. Please request a new invitation.");
    }
  }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${baseUrl}/auth/admin/setup-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, token, password })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account password configured successfully! Redirecting to login...", {
          autoClose: 3000
        });
        setTimeout(() => {
          navigate("/admin/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to configure password. Link may be invalid or expired.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f7f9] p-4 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Top Logo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <svg className="w-6 h-6 text-[#002a32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
          </svg>
          <span className="text-2xl font-serif font-bold text-[#002a32] tracking-tight">LexScripta</span>
        </div>
        <span className="text-[10px] font-extrabold text-[#7c8b96] uppercase tracking-[0.15em]">
          Secure Board Registration
        </span>
      </div>

      {/* Setup Password Card */}
      <div className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200/80 w-full max-w-[420px]">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold font-serif text-[#002a32] tracking-tight mb-2">
            Configure Password
          </h2>
          <div className="w-8 h-1 bg-[#8c6d23] mx-auto rounded-full"></div>
        </div>

        {error ? (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg text-center font-semibold">
            {error}
          </div>
        ) : (
          <div className="mb-6 p-3 bg-gray-50 border border-gray-100 rounded-lg text-center">
            <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Registering Account:</p>
            <p className="text-xs font-bold text-[#002a32] break-all">{email}</p>
          </div>
        )}

        {(!error || error !== "Invalid or incomplete registration link. Please request a new invitation.") && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                className="block w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] transition-colors"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="block w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#002a32] focus:border-[#002a32] transition-colors"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || error}
              className="w-full bg-[#002a32] text-white py-3 px-4 rounded-lg hover:bg-[#003d49] transition duration-300 disabled:opacity-50 font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
            >
              <span>{isLoading ? "Saving Credentials..." : "Configure Account"}</span>
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-8 space-y-1">
        <p className="text-[10px] font-bold text-gray-400">
          &copy; 2026 LexScripta Legal Publishing. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SetupPassword;
