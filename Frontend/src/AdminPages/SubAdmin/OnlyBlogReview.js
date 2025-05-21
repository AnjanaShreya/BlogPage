import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminTopbar from '../AdminComponents/AdminTopbar';

const OnlyBlogReview = () => {
  const navigate = useNavigate();
  const [pendingBlogs, setPendingBlogs] = useState(0);
  const [pendingReviewBlogs, setPendingReviewBlogs] = useState(0);

  const tabs = [
    { label: 'Dashboard', path: '/admin/onlyblogreview' },
    { label: 'First Submission', path: '/admin/subadminaprroval' },
    { label: 'Blog Reviews', path: '/admin/subadminreviews' },
  ];

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
          const [blogsRes, reviewRes] = await Promise.all([
            fetch('http://localhost:5000/api/blogs/count/pending', {
              credentials: 'include' // Needed if using session cookies
            }),
            fetch('http://localhost:5000/api/blogs/count/review', {
              credentials: 'include' // Needed if using session cookies
            })
          ]);
        
          const blogsData = await blogsRes.json();
          const reviewData = await reviewRes.json();
        
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
    <div className="h-screen bg-gradient-to-br from-amber-50 to-gray-200">
      <AdminTopbar tabs={tabs} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subadmin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage blog submissions and reviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/admin/subadminaprroval" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-blue-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">First Submission</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Review and approve initial blog submissions
                </p>
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/subadminreviews" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-green-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Blog Reviews</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage all blog reviews and feedback
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-blue-800">Pending Approvals</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{pendingBlogs}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm font-medium text-green-800">Reviews Completed</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{pendingReviewBlogs}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlyBlogReview;