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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Admin Portal
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#002a32d5] focus:border-[#002a32d5]"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#002a32d5] focus:border-[#002a32d5]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#002a32d5] text-white py-2 rounded-lg hover:bg-[#002a32] transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;