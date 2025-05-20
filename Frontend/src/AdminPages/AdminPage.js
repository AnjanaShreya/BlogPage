import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import AdminTopbar from './AdminComponents/AdminTopbar';

const AdminPage = () => {
  const navigate = useNavigate();
  const [upcomingPrograms, setUpcomingPrograms] = useState(0);
  const [upcomingMoots, setUpcomingMoots] = useState(0);
  const [pendingBlogs, setPendingBlogs] = useState(0);
  const [pendingReviewBlogs, setPendingReviewBlogs] = useState(0);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/admin/dashboard', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Not authorized');
      } catch {
        sessionStorage.removeItem('isAdmin');
        navigate('/admin/login');
      }
    };

    // Update your fetchStats function
    const fetchStats = async () => {
      try {
        const [programRes, mootRes, blogsRes, reviewRes] = await Promise.all([
          fetch('http://localhost:5000/api/programs/count/upcoming'),
          fetch('http://localhost:5000/api/moot-courts/count/upcoming'),
          fetch('http://localhost:5000/api/blogs/count/pending', {
            credentials: 'include' // Needed if using session cookies
          }),
          fetch('http://localhost:5000/api/blogs/count/review', {
            credentials: 'include' // Needed if using session cookies
          })
        ]);
      
        const programData = await programRes.json();
        const mootData = await mootRes.json();
        const blogsData = await blogsRes.json();
        const reviewData = await reviewRes.json();
      
        setUpcomingPrograms(programData.count || 0);
        setUpcomingMoots(mootData.count || 0);
        setPendingBlogs(blogsData.count || 0);
        setPendingReviewBlogs(reviewData.count || 0);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    
        verifyAdmin();
        fetchStats();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-200">
      <AdminTopbar />
      
      <main className="container mx-auto p-6">
        {/* Main Admin Controls Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-4 border-l-4 border-[#002a32d5]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-[#002a32d5] text-white p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            ADMIN CONTROLS
          </h2>
          <p className="text-gray-600 ml-14">Manage all administrative functions from this dashboard</p>
        </div>

        {/* Control Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Blogs Card */}
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group border border-gray-100"
            onClick={() => navigate('/admin/approveblogs')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#002a32d5] transition-colors duration-200">
                  Blogs To Be Approved
                </h3>
                <p className="text-gray-500 mt-1">Review and approval of first blog submissions</p>
              </div>
              <FaArrowRight className="text-2xl text-[#002a32d5] group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group border border-gray-100"
            onClick={() => navigate('/admin/reviewblogs')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#002a32d5] transition-colors duration-200">
                  Blogs Review Page
                </h3>
                <p className="text-gray-500 mt-1">Blogs submitted again based on feedback</p>
              </div>
              <FaArrowRight className="text-2xl text-[#002a32d5] group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>

          {/* Programs Card */}
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group border border-gray-100"
            onClick={() => navigate('/admin/swprograms')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#002a32d5] transition-colors duration-200">
                  Summer And Winter Programs
                </h3>
                <p className="text-gray-500 mt-1">Manage seasonal programs and events</p>
              </div>
              <FaArrowRight className="text-2xl text-[#002a32d5] group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>

          {/* Moot Courts Card */}
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group border border-gray-100"
            onClick={() => navigate('/admin/mootcourt')}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#002a32d5] transition-colors duration-200">
                  Moot Courts
                </h3>
                <p className="text-gray-500 mt-1">Manage moot court competitions and events</p>
              </div>
              <FaArrowRight className="text-2xl text-[#002a32d5] group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>

        {/* Stats Section (Optional) */}
        <div className="mt-4 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Quick Stats</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Pending Blogs</p>
              <p className="text-2xl font-bold text-[#002a32d5]">{pendingBlogs}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Pending Review Blogs</p>
              <p className="text-2xl font-bold text-[#002a32d5]">{pendingReviewBlogs}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Upcoming Programs</p>
              <p className="text-2xl font-bold text-[#002a32d5]">{upcomingPrograms}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Upcoming Moots</p>
              <p className="text-2xl font-bold text-[#002a32d5]">{upcomingMoots}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage