import React, { useState, useEffect } from "react";
import AdminTopbar from "./AdminComponents/AdminTopbar";
import { useNavigate } from "react-router-dom";
import { FiLoader, FiAlertCircle, FiCheck } from "react-icons/fi";
import BlogCard from "./AdminComponents/BlogCard";
import BlogDetailModal from "./AdminComponents/BlogDetailModal";
import { useAuth } from "../context/AuthContext";

const ApproveBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewComments, setReviewComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState(null);
  const navigate = useNavigate();
  const { user, loading: authLoading, verifySession } = useAuth();

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

        const response = await fetch(`${baseUrl}/api/blogs/pending`, {
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
            throw new Error("Failed to fetch pending blogs");
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

  const fetchPendingBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${baseUrl}/api/blogs/pending`, {
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
        throw new Error("Failed to fetch pending blogs");
      }
    } catch (err) {
      console.error("Error fetching pending blogs:", err);
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
      <div className="min-h-screen bg-gray-50">
        <AdminTopbar tabs={tabs} />
        <div className="flex items-center justify-center h-64">
          <FiLoader className="animate-spin text-4xl text-blue-500" />
          <span className="ml-3 text-xl">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminTopbar tabs={tabs} />
        <div className="flex items-center justify-center h-64">
          <FiLoader className="animate-spin text-4xl text-blue-500" />
          <span className="ml-3 text-xl">Loading pending blogs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 to-gray-200">
      <AdminTopbar tabs={tabs} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pending Blogs for Approval</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {blogs.length} pending
          </span>
        </div>

        {blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FiCheck className="mx-auto text-5xl text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No pending blogs</h2>
            <p className="text-gray-500">All blogs have been reviewed</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
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
                showReviewComments={true}
                showApproveOptions={true}
              />
            ))}
          </div>
        )}

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
      </div>
    </div>
  );
};

export default ApproveBlogs;