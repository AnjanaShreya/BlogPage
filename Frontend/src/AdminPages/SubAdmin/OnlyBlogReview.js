import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../AdminComponents/AdminLayout';
import { FaCheckCircle, FaEdit, FaChartBar, FaAngleRight } from 'react-icons/fa';

const OnlyBlogReview = () => {
  const navigate = useNavigate();
  const [pendingBlogs, setPendingBlogs] = useState(0);
  const [pendingReviewBlogs, setPendingReviewBlogs] = useState(0);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await fetch(`${baseUrl}/auth/admin/dashboard`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Not authorized');
      } catch {
        sessionStorage.removeItem('isAdmin');
        navigate('/admin/login');
      }
    };

    const fetchStats = async () => {
      try {
        const [blogsRes, reviewRes] = await Promise.all([
          fetch(`${baseUrl}/api/blogs/count/pending`, { credentials: 'include' }),
          fetch(`${baseUrl}/api/blogs/count/review`, { credentials: 'include' })
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
  }, [navigate, baseUrl]);

  return (
    <AdminLayout>
      <main className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 bg-[#F9FAFB]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#002a32] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">Subadmin Portal</span>
              <span className="text-xs font-semibold text-gray-500">LexScripta Board</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#002a32] font-serif tracking-tight">Subadmin Dashboard</h1>
            <p className="text-gray-500 font-medium max-w-4xl mt-3 leading-relaxed text-sm">
              Review and audit newly submitted publications and coordinate critical peer review comments.
            </p>
          </div>
        </div>

        {/* Dashboard Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/admin/subadminaprroval" 
            className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-start justify-between group"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 bg-[#E0F2F1] text-[#004D40] p-4 rounded-xl text-xl">
                <FaCheckCircle />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#002a32] font-serif">First Submission</h2>
                <p className="mt-1.5 text-xs text-gray-400 font-semibold leading-relaxed">
                  Review and audit initial incoming student & expert blog submissions.
                </p>
                <div className="mt-4 inline-flex items-center text-xs font-bold text-[#004D40] gap-1">
                  <span>Open Submissions</span>
                  <FaAngleRight className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/subadminreviews" 
            className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-start justify-between group"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 bg-[#8C6D23]/10 text-[#8C6D23] p-4 rounded-xl text-xl">
                <FaEdit />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#002a32] font-serif">Blog Reviews</h2>
                <p className="mt-1.5 text-xs text-gray-400 font-semibold leading-relaxed">
                  Manage ongoing reviews and annotated feedback requests for revision.
                </p>
                <div className="mt-4 inline-flex items-center text-xs font-bold text-[#8C6D23] gap-1">
                  <span>Open Active Reviews</span>
                  <FaAngleRight className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats Banner */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
              <FaChartBar className="text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#002a32] uppercase tracking-wider">Live Metrics</h3>
              <p className="text-[10px] text-gray-400 font-semibold">Real-time statistics of submissions</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-widest block">Pending Approvals</span>
              <span className="mt-2 text-4xl font-extrabold text-emerald-700 block">{pendingBlogs}</span>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-widest block">Reviews Requiring Attention</span>
              <span className="mt-2 text-4xl font-extrabold text-amber-700 block">{pendingReviewBlogs}</span>
            </div>
          </div>
        </div>

      </main>
    </AdminLayout>
  );
};

export default OnlyBlogReview;