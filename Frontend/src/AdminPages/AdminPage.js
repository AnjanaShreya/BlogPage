import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verify admin status on component mount
    const verifyAdmin = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/admin/dashboard', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Not authorized');
        }
      } catch (error) {
        sessionStorage.removeItem('isAdmin');
        navigate('/admin/login');
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });
      sessionStorage.removeItem('isAdmin');
      navigate('/adminlogin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-200">
      <header className="bg-[#002a32d5] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="bg-white text-[#002a32d5] px-4 py-2 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Admin Controls</h2>
          {/* Admin content here */}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;