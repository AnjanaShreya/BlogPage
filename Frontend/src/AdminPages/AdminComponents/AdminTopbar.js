import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminTopbar = ({ tabs = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      sessionStorage.removeItem('isAdmin');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-[#002a32d5] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>

        <div>
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                location.pathname === tab.path
                  ? 'bg-white text-[#002a32d5]'
                  : 'text-white hover:bg-[#002a32]'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="bg-white text-[#002a32d5] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
