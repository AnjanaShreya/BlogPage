import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminTopbar from './AdminComponents/AdminTopbar';
import { FaArrowRight } from 'react-icons/fa';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, loading, verifySession } = useAuth();
  const [stats, setStats] = useState({
    upcomingPrograms: 0,
    upcomingMoots: 0,
    pendingBlogs: 0,
    pendingReviewBlogs: 0
  });

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const tabs = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Blog Approvals', path: '/admin/approveblogs' },
    { label: 'Blog Reviews', path: '/admin/onlyblogreview' },
    { label: 'SW Programs', path: '/admin/swprograms' },
    { label: 'MootCourts', path: '/admin/mootcourt' }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifySession();
      if (!isValid || !user || (user.role !== 'admin' && user.role !== 'subadmin')) {
        navigate('/admin/login');
      }
    };

    const fetchStats = async () => {
      try {
        const [programs, moots, blogs, reviews] = await Promise.all([
          fetch(`${baseUrl}/api/programs/count/upcoming`),
          fetch(`${baseUrl}/api/moot-courts/count/upcoming`),
          fetch(`${baseUrl}/api/blogs/count/pending`, { credentials: 'include' }),
          fetch(`${baseUrl}/api/blogs/count/review`, { credentials: 'include' })
        ]);

        setStats({
          upcomingPrograms: (await programs.json()).count || 0,
          upcomingMoots: (await moots.json()).count || 0,
          pendingBlogs: (await blogs.json()).count || 0,
          pendingReviewBlogs: (await reviews.json()).count || 0
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (!loading) {
      checkAuth();
      fetchStats();
    }
  }, [navigate, user, loading, verifySession, baseUrl]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-200">
      <AdminTopbar tabs={tabs} userRole={user?.role} />
      
      <main className="container mx-auto p-6">
        {/* Dashboard Content */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-[#002a32d5]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, {user?.role === 'admin' ? 'Admin' : 'Administrator'} ...!!
          </h2>
          <p className="text-gray-600">
            You have access to {user?.role === 'admin' ? 'all administrative' : 'blog review'} functions
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className="text-2xl font-bold text-[#002a32d5] mt-2">{value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tabs
              .filter(tab => 
                tab.path !== '/admin/dashboard' && 
                (user?.role === 'admin' || tab.path !== '/admin/onlyblogreview')
              )
              .map(tab => (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-left flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium text-gray-800">{tab.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {tab.label.includes('Blog') ? 'Manage blog submissions' : 'Manage programs and events'}
                    </p>
                  </div>
                  <FaArrowRight className="text-2xl text-[#002a32d5] group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;