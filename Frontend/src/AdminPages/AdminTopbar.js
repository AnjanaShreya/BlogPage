import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminTopbar = () => {
	const navigate = useNavigate();
  const location = useLocation();
	
	const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });
      sessionStorage.removeItem('isAdmin');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <header className="bg-[#002a32d5] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <div>
            <Link 
              to="/admin/dashboard"
              className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                location.pathname === '/admin/dashboard' 
                  ? 'bg-white text-[#002a32d5]' 
                  : 'text-white hover:bg-[#002a32]'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/approveblogs"
              className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                location.pathname === '/admin/approveblogs' 
                  ? 'bg-white text-[#002a32d5]' 
                  : 'text-white hover:bg-[#002a32]'
              }`}
            >
              Blog Approvals
            </Link>
            <Link 
              to="/admin/swprograms"
              className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                location.pathname === '/admin/swprograms' 
                  ? 'bg-white text-[#002a32d5]' 
                  : 'text-white hover:bg-[#002a32]'
              }`}
            >
              SW Programs
            </Link>
            <Link 
              to="/admin/mootcourt"
              className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                location.pathname === '/admin/mootcourt' 
                  ? 'bg-white text-[#002a32d5]' 
                  : 'text-white hover:bg-[#002a32]'
              }`}
            >
              MootCourts
            </Link>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white text-[#002a32d5] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
          >
            Logout
          </button>
        </div>
      </header>
    </div>
  )
}

export default AdminTopbar
