import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaBookOpen, 
  FaCheckCircle, 
  FaEdit, 
  FaCalendarAlt, 
  FaPlus, 
} from 'react-icons/fa';
import img0 from '../assets/img0.jpg';
import BlogDetailModal from './AdminComponents/BlogDetailModal';
import AdminLayout from './AdminComponents/AdminLayout';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, loading, verifySession, logout } = useAuth();
  
  // Dashboard states
  const [stats, setStats] = useState({
    totalArticles: 1284,
    pendingApprovals: 24,
    revisionRequests: 18,
    totalContributors: 456,
    upcomingEvents: 8,
    mootReg: 1402,
    monthlyVisitors: '42.5K',
    approvedArticles: 1242
  });
  
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [reviewBlogs, setReviewBlogs] = useState([]);
  const [mootCourts, setMootCourts] = useState([]);
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Selected blog modal state
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewComments, setReviewComments] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const isValid = await verifySession();
        if (!isValid || !user || (user.role !== 'admin' && user.role !== 'subadmin')) {
          navigate('/admin/login');
          return;
        }
        
        setIsLoadingData(true);
        // Fetch pending blogs (for table)
        const pendingRes = await fetch(`${baseUrl}/api/blogs/pending`, { credentials: 'include' });
        const pendingData = await pendingRes.json();
        setPendingBlogs(Array.isArray(pendingData.data) ? pendingData.data : (Array.isArray(pendingData) ? pendingData : []));

        // Fetch review blogs (for table)
        const reviewRes = await fetch(`${baseUrl}/api/blogs/review`, { credentials: 'include' });
        const reviewData = await reviewRes.json();
        setReviewBlogs(Array.isArray(reviewData.data) ? reviewData.data : (Array.isArray(reviewData) ? reviewData : []));

        // Fetch upcoming moot courts (for events section)
        const mootRes = await fetch(`${baseUrl}/api/moot-courts`);
        const mootData = await mootRes.json();
        setMootCourts(mootData.data || []);

        // Fetch real counts to merge into stats cards
        const [programsCountRes, mootsCountRes, pendingCountRes, reviewCountRes] = await Promise.all([
          fetch(`${baseUrl}/api/programs/count/upcoming`),
          fetch(`${baseUrl}/api/moot-courts/count/upcoming`),
          fetch(`${baseUrl}/api/blogs/count/pending`, { credentials: 'include' }),
          fetch(`${baseUrl}/api/blogs/count/review`, { credentials: 'include' })
        ]);

        const progCountVal = (await programsCountRes.json()).count || 0;
        const mootCountVal = (await mootsCountRes.json()).count || 0;
        const pendingCountVal = (await pendingCountRes.json()).count || 0;
        const reviewCountVal = (await reviewCountRes.json()).count || 0;

        setStats(prev => ({
          ...prev,
          pendingApprovals: pendingCountVal || prev.pendingApprovals,
          revisionRequests: reviewCountVal || prev.revisionRequests,
          upcomingEvents: (progCountVal + mootCountVal) || prev.upcomingEvents
        }));

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!loading) {
      checkAuthAndFetch();
    }
  }, [navigate, user, loading, verifySession, baseUrl]);

  // Actions handlers
  const handleApprove = async (blogId) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`${baseUrl}/api/blogs/approve/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: user?.id, action: 'approve' }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve blog");
      }

      setPendingBlogs(prev => prev.filter(b => b._id !== blogId));
      setSelectedBlog(null);
      toast.success("Blog approved successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleReject = async (blogId) => {
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      toast.warn("Please provide a rejection reason (minimum 10 characters)");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`${baseUrl}/api/blogs/reject/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          adminId: user?.id, 
          rejectionReason: rejectionReason.trim(),
          action: 'reject'
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject blog");
      }

      setPendingBlogs(prev => prev.filter(b => b._id !== blogId));
      setSelectedBlog(null);
      setRejectionReason("");
      toast.success("Blog rejected successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleRequestRevision = async (blogId) => {
    if (!reviewComments || reviewComments.trim().length < 10) {
      toast.warn("Please provide review comments (minimum 10 characters)");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`${baseUrl}/api/blogs/request-revision/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          adminId: user?.id, 
          reviewComments: reviewComments.trim() 
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to request revision");
      }

      setPendingBlogs(prev => prev.filter(b => b._id !== blogId));
      setSelectedBlog(null);
      setReviewComments("");
      toast.success("Revision requested successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#002a32]"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
        {/* CONTAINER MAIN SCREEN CONTENTS */}
        <main className="flex-grow overflow-y-auto p-5 md:p-6 space-y-6 max-w-[1400px] w-full mx-auto">
          
          {/* A. WELCOME BANNER */}
          <section className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-[#1b434d] via-[#103036] to-[#0d2327]">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Left Column Text details */}
              <div className="lg:col-span-8 p-6 md:p-8 text-left">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 font-serif tracking-wide leading-tight">
                  Welcome, Administrator
                </h2>
                <p className="text-gray-200 text-xs md:text-sm leading-relaxed max-w-xl mb-6">
                  The publication queue is currently processing {pendingBlogs.length + 12} new manuscripts. You have {pendingBlogs.length} urgent approval requests from the Constitutional Law department.
                </p>
                <div className="flex flex-wrap gap-3.5">
                  <button className="py-2 px-5 bg-[#ecc260] hover:bg-[#e0b24c] text-[#002a32] font-bold text-xs md:text-sm rounded-xl transition-all duration-200 shadow">
                    Manage Platform
                  </button>
                  <button className="py-2 px-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs md:text-sm rounded-xl transition-all duration-200">
                    View Pending Tasks (12)
                  </button>
                </div>
              </div>

              {/* Right Column Image details */}
              <div className="lg:col-span-4 self-stretch min-h-[200px] lg:min-h-full bg-cover bg-center relative" style={{ backgroundImage: `url(${img0})` }}>
                <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-l from-transparent via-[#103036]/50 to-[#103036]"></div>
              </div>
            </div>
          </section>

          {/* B. STATS GRID CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Articles */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow transition-all flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Articles</span>
                <h3 className="text-3xl font-extrabold text-[#002a32] mt-2 font-serif">{stats.totalArticles}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+5.2% ↗</span>
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl mt-3"><FaBookOpen /></div>
              </div>
            </div>

            {/* Card 2: Pending Approvals */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow transition-all flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Approvals</span>
                <h3 className="text-3xl font-extrabold text-[#002a32] mt-2 font-serif">{stats.pendingApprovals}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Current</span>
                <div className="bg-yellow-50 text-yellow-600 p-2.5 rounded-xl mt-3"><FaCheckCircle /></div>
              </div>
            </div>

            {/* Card 3: Revision Requests */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow transition-all flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revision Requests</span>
                <h3 className="text-3xl font-extrabold text-[#002a32] mt-2 font-serif">{stats.revisionRequests}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">+12% ↗</span>
                <div className="bg-red-50 text-red-600 p-2.5 rounded-xl mt-3"><FaEdit /></div>
              </div>
            </div>

            {/* Card 5: Upcoming Events */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow transition-all flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Upcoming Events</span>
                <h3 className="text-3xl font-extrabold text-[#002a32] mt-2 font-serif">{stats.upcomingEvents}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Next 30 days</span>
                <div className="bg-purple-50 text-purple-600 p-2.5 rounded-xl mt-3"><FaCalendarAlt /></div>
              </div>
            </div>

          </section>


          {/* D. GRID: EVENTS & Timeline */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Events list */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-serif text-[#002a32]">Events & Competitions</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate('/admin/swprograms')}
                    className="py-1.5 px-3.5 bg-[#002a32] hover:bg-[#003d49] text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                  >
                    <FaPlus />
                    <span>Create New Event</span>
                  </button>
                </div>
              </div>

              {/* Upcoming Event items */}
              <div className="space-y-4">
                {mootCourts.filter(mc => new Date(mc.date) >= new Date()).length === 0 ? (
                  <p className="text-sm text-gray-400 font-semibold py-6 text-center">no upcoming events</p>
                ) : (
                  mootCourts
                    .filter(mc => new Date(mc.date) >= new Date())
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 5)
                    .map((mc) => (
                      <div key={mc._id} className="rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          {/* Date badge */}
                          <div className="flex flex-col items-center justify-center bg-[#E0F2F1] text-[#004D40] rounded-xl px-3 py-2 min-w-[56px]">
                            <span className="text-lg font-extrabold leading-none">{new Date(mc.date).getDate()}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider">{new Date(mc.date).toLocaleString('en-US', { month: 'short' })}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-[#002a32] text-sm leading-snug">{mc.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-semibold text-gray-400">📍 {mc.venue}</span>
                              <span className="text-[10px] font-semibold text-gray-400">👥 {mc.teams} Teams</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigate('/admin/mootcourt')}
                          className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Right: Top Contributors */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 md:p-6">
            <h3 className="text-xl font-bold font-serif text-[#002a32] mb-6">Top Contributors</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-4">Name</th>
                    <th className="py-4 px-4">University / Institution</th>
                    <th className="py-4 px-4">Articles Published</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  
                  {/* Contributor 1 */}
                  <tr className="hover:bg-gray-50/50 transition-colors text-xs md:text-sm">
                    <td className="py-4 px-4 font-bold text-[#002a32] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">JR</div>
                      <span>Julianne</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 font-medium">Harvard Law School</td>
                    <td className="py-4 px-4 text-gray-500 font-bold">12 Articles</td>
                  </tr>

                  {/* Contributor 2 */}
                  <tr className="hover:bg-gray-50/50 transition-colors text-xs md:text-sm">
                    <td className="py-4 px-4 font-bold text-[#002a32] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-bold flex items-center justify-center">AM</div>
                      <span>Aarav Mehta</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 font-medium">National Law School</td>
                    <td className="py-4 px-4 text-gray-500 font-bold">8 Articles</td>
                  </tr>

                  {/* Contributor 3 */}
                  <tr className="hover:bg-gray-50/50 transition-colors text-xs md:text-sm">
                    <td className="py-4 px-4 font-bold text-[#002a32] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center">LC</div>
                      <span>Leila Chen</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 font-medium">Oxford University</td>
                    <td className="py-4 px-4 text-gray-500 font-bold">9 Articles</td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
          </section>

        </main>

      {/* DETAILED BLOG DIALOG MODAL VIEW */}
      {selectedBlog && (
        <BlogDetailModal
          blog={selectedBlog}
          onClose={() => {
            setSelectedBlog(null);
            setActionType(null);
            setRejectionReason("");
            setReviewComments("");
          }}
          actionType={actionType}
          rejectionReason={rejectionReason}
          reviewComments={reviewComments}
          onRejectionReasonChange={(e) => setRejectionReason(e.target.value)}
          onReviewCommentsChange={(e) => setReviewComments(e.target.value)}
          onApprove={() => handleApprove(selectedBlog._id)}
          onRequestRevision={() => handleRequestRevision(selectedBlog._id)}
          onReject={() => handleReject(selectedBlog._id)}
          isProcessing={isProcessing}
        />
      )}
    </AdminLayout>
  );
};

export default AdminPage;