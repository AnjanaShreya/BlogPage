import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminComponents/AdminLayout";
import { useNavigate } from "react-router-dom";
import { FiLoader, FiAlertCircle, FiCheck } from "react-icons/fi";
import BlogCard from "./AdminComponents/BlogCard";
import BlogDetailModal from "./AdminComponents/BlogDetailModal";
import { useAuth } from "../context/AuthContext";

const BlogReview = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewComments, setReviewComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [appliedFilterCategory, setAppliedFilterCategory] = useState("All Categories");
  const [appliedSortOrder, setAppliedSortOrder] = useState("Newest First");
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;
  
  const navigate = useNavigate();
  const { user, loading: authLoading, verifySession } = useAuth();

  // Filter & Sort logic
  const filteredAndSortedBlogs = React.useMemo(() => {
    let result = [...blogs];
    if (appliedFilterCategory !== "All Categories") {
      result = result.filter(blog => blog.category === appliedFilterCategory);
    }
    if (appliedSortOrder === "Newest First") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (appliedSortOrder === "Oldest First") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return result;
  }, [blogs, appliedFilterCategory, appliedSortOrder]);

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredAndSortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredAndSortedBlogs.length / blogsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const tabs = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Blog Approvals', path: '/admin/approveblogs' },
    { label: 'Blog Reviews', path: '/admin/reviewblogs' },
    { label: 'SW Programs', path: '/admin/swprograms' },
    { label: 'MootCourts', path: '/admin/mootcourt' }
  ];

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndFetch = async () => {
      try {
        // First verify session
        const isAuthenticated = await verifySession();
        
        if (!isAuthenticated || user?.role !== 'admin') {
          if (isMounted) {
            navigate("/admin/login");
          }
          return;
        }

        // Only fetch blogs if authenticated and authorized
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const response = await fetch(`${baseUrl}/api/blogs/review`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include'
        });

        if (isMounted) {
          if (response.status === 200) {
            const result = await response.json();
            setBlogs(Array.isArray(result.data) ? result.data : result);
          } else if (response.status === 401) {
            navigate("/admin/login");
          } else {
            throw new Error("Failed to fetch pending blogs needing review");
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error in checkAuthAndFetch:", err);
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Only run if authLoading is false (auth state is initialized)
    if (!authLoading) {
      checkAuthAndFetch();
    }

    return () => {
      isMounted = false;
    };
  }, [navigate, baseUrl, user?.role, authLoading]);

  const fetchReviewBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${baseUrl}/api/blogs/review`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      if (response.status === 200) {
        const result = await response.json();
        setBlogs(Array.isArray(result.data) ? result.data : result);
      } else if (response.status === 401) {
        navigate("/admin/login");
      } else {
        throw new Error("Failed to fetch pending blogs needing review");
      }
    } catch (err) {
      console.error("Error fetching review blogs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailNotification = async (email, subject, message) => {
    try {
      const response = await fetch(`${baseUrl}/api/email/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: email,
          subject,
          text: message
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        console.error("Failed to send email notification");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleApprove = async (blogId) => {
    if (!blogId || blogId.length !== 24) {
      alert("Invalid blog ID");
      return;
    }

    try {
      setIsProcessing(true);
      setActionType('approve');
      const response = await fetch(`${baseUrl}/api/blogs/approve/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          adminId: user?.id,
          action: 'approve'
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve blog");
      }

      const approvedBlog = blogs.find(blog => blog._id === blogId);
      
      if (approvedBlog && approvedBlog.author && approvedBlog.author.email) {
        const subject = "Your Blog Has Been Approved";
        const message = `Dear ${approvedBlog.name},\n\n` +
          `We're pleased to inform you that your blog titled "${approvedBlog.heading}" has been approved.\n\n` +
          `You can now view it on our website.\n\n` +
          `Thank you for your contribution!\n\n` +
          `Best regards,\nThe Blog Team`;
        
        await sendEmailNotification(approvedBlog.author.email, subject, message);
      }

      setBlogs(blogs.filter(blog => blog._id !== blogId));
      setSelectedBlog(null);
      alert("Blog approved successfully!");
    } catch (error) {
      console.error("Error approving blog:", error);
      alert(error.message || "An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleReject = async (blogId) => {
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      alert("Please provide a valid reason for rejection (minimum 10 characters)");
      return;
    }

    try {
      setIsProcessing(true);
      setActionType('reject');
      const response = await fetch(`${baseUrl}/api/blogs/reject/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
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

      const rejectedBlog = blogs.find(blog => blog._id === blogId);
      
      if (rejectedBlog && rejectedBlog.author && rejectedBlog.author.email) {
        const subject = "Update on Your Blog Submission";
        const message = `Dear ${rejectedBlog.name},\n\n` +
          `We regret to inform you that your blog titled "${rejectedBlog.heading}" could not be approved.\n\n` +
          `Reason for rejection: ${rejectionReason.trim()}\n\n` +
          `You may submit a new blog for consideration.\n\n` +
          `Thank you for your understanding.\n\n` +
          `Best regards,\nThe Blog Team`;
        
        await sendEmailNotification(rejectedBlog.author.email, subject, message);
      }

      setBlogs(blogs.filter(blog => blog._id !== blogId));
      setSelectedBlog(null);
      setRejectionReason("");
      alert("Blog rejected successfully!");
    } catch (error) {
      console.error("Error rejecting blog:", error);
      alert(error.message || "An error occurred while rejecting the blog");
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleRequestRevision = async (blogId) => {
    if (!reviewComments || reviewComments.trim().length < 10) {
      alert("Please provide detailed review comments (minimum 10 characters)");
      return;
    }

    try {
      setIsProcessing(true);
      setActionType('request-revision');
      
      const response = await fetch(`${baseUrl}/api/blogs/request-revision/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
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

      setBlogs(blogs.filter(blog => blog._id !== blogId));
      setSelectedBlog(null);
      setReviewComments("");
      
      alert("Revision requested successfully! The author has been notified.");
    } catch (error) {
      console.error("Error requesting revision:", error);
      alert(error.message || "An error occurred while requesting revision");
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedBlog(null);
    setRejectionReason("");
    setReviewComments("");
    setActionType(null);
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <FiLoader className="animate-spin text-4xl text-[#002a32]" />
          <span className="ml-3 text-xl font-bold text-gray-500">Verifying session...</span>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <FiLoader className="animate-spin text-4xl text-[#002a32]" />
          <span className="ml-3 text-xl font-bold text-gray-500">Loading reviewed blogs...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <FiAlertCircle className="text-4xl text-red-500" />
          <span className="ml-3 text-xl font-bold text-red-600">{error}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 bg-[#F9FAFB]">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#002a32] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">Review Queue</span>
              <span className="text-xs font-semibold text-gray-500">Updated just now</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#002a32] font-serif tracking-tight">Reviewed Blogs Pending for Approval</h1>
            <p className="text-gray-500 font-medium max-w-2xl mt-4 leading-relaxed text-sm">
              Reviewed blogs waiting for approval
            </p>
          </div>

          <div className="bg-gray-100/80 rounded-2xl px-10 py-5 text-center shadow-sm border border-gray-200 min-w-[200px]">
            <span className="block text-4xl font-extrabold text-[#002a32] mb-1">{blogs.length}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reviewed Submissions</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-sm border border-gray-100 p-3 gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Filter by:
            </span>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-md focus:ring-[#002a32] focus:border-[#002a32] block p-1.5 font-bold outline-none cursor-pointer max-w-[200px]"
            >
              <option value="All Categories">All Categories</option>
              <option value="Constitution of India">Constitution of India</option>
              <option value="The Code of Civil Procedure 1908">Civil Procedure (CPC)</option>
              <option value="Administrative Law">Administrative Law</option>
              <option value="The Law of Contracts">Contract Law</option>
              <option value="BNSS 2023">BNSS 2023</option>
              <option value="The Law of Evidence">Evidence Act</option>
              <option value="Law of Torts">Law of Torts</option>
              <option value="Election Laws">Election Laws</option>
              <option value="Human Rights">Human Rights</option>
              <option value="Constitutional Law">Constitutional Law</option>
              <option value="Corporate Law">Corporate Law</option>
              <option value="Criminal Law">Criminal Law</option>
            </select>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-md focus:ring-[#002a32] focus:border-[#002a32] block p-1.5 font-bold outline-none cursor-pointer"
            >
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button 
              onClick={() => {
                setFilterCategory("All Categories");
                setAppliedFilterCategory("All Categories");
                setSortOrder("Newest First");
                setAppliedSortOrder("Newest First");
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              Clear Filters
            </button>
            <button 
              onClick={() => {
                setAppliedFilterCategory(filterCategory);
                setAppliedSortOrder(sortOrder);
                setCurrentPage(1);
              }}
              className="bg-[#002a32] hover:bg-[#003d49] text-white font-bold text-xs px-4 py-1.5 rounded-md transition shadow-sm cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-4xl text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">You're all caught up!</h2>
            <p className="text-gray-500 font-medium">There are no pending blogs requiring your review at this time.</p>
          </div>
        ) : filteredAndSortedBlogs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">No matching submissions</h2>
            <p className="text-gray-500 font-medium text-sm mb-4">No pending blogs fit the selected filter criteria.</p>
            <button 
              onClick={() => {
                setFilterCategory("All Categories");
                setAppliedFilterCategory("All Categories");
                setSortOrder("Newest First");
                setAppliedSortOrder("Newest First");
                setCurrentPage(1);
              }}
              className="bg-[#002a32] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#003d49] transition shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onView={() => setSelectedBlog(blog)}
                onApprove={() => {
                  setSelectedBlog(blog);
                  setActionType('approve');
                }}
                onRequestRevision={() => {
                  setSelectedBlog(blog);
                  setActionType('request-revision');
                }}
                onReject={() => {
                  setSelectedBlog(blog);
                  setActionType('reject');
                }}
                isProcessing={isProcessing}
                actionType={actionType}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 mb-8">
            <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#002a32] hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
              >&lt;</button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition cursor-pointer ${
                    currentPage === i + 1 
                      ? 'bg-[#002a32] text-white' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#002a32] hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
              >&gt;</button>
            </div>
          </div>
        )}

      </main>

      {/* DETAILED BLOG DIALOG MODAL VIEW */}
      {selectedBlog && (
        <BlogDetailModal
          blog={selectedBlog}
          onClose={handleCloseModal}
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

export default BlogReview;